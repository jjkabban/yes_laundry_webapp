import { Response, Request, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import {
  LoginRequestPayload,
  LoginResponsePayload,
  User,
  RegisterRequestPayload,
  RegisterResponsePayload,
  VerifyRequestPayload,
  VerifyResponsePayload,
  Role,
  LocationResponsePayload,
  LocationRequestPayload,
} from "./types/auth";
import { ApiResponse } from "./types/auth.response";
import bcrypt from "bcrypt";
import { getOtp } from "../util/otp";
import { sendSMSOtp } from "../services/sms";
import { getSessionDuration } from "../util/session";
import { oauth2Client } from "../lib/oauth";
import { SESSION_DURATION } from "../constants/session";
import { google } from "googleapis";
import { sendEmailOtp } from "../services/mail";
import { authRouter } from "../routes";

export const signin = async (
  req: Request<{}, {}, LoginRequestPayload>,
  res: Response<ApiResponse<LoginResponsePayload>>,
  next: NextFunction,
) => {
  try {
    const { phoneNumber, password, rememberMe, email } = req.body;
    const findUser = await prisma.user.findFirst({
      where: { OR: [{ phoneNumber: phoneNumber }, { email: email }] },
      select: {
        profileImage: { select: { url: true } },
        firstName: true,
        lastName: true,
        id: true,
        hashedPassword: true,
        phoneNumber: true,
        email: true,
        role: true,
        locations: {
          select: {
            isDefault: true,
            address: true,
            label: true,
            city: true,
            neighborhood: true,
          },
        },
      },
    });
    if (!findUser) {
      return res.status(404).json({
        message: "Validation error",
        error: [
          {
            field: "email",
            message: !email
              ? "Incorrect email. Check and try again"
              : !phoneNumber
                ? "Incorrect phone number. Check and try again"
                : "Incorrect credentials",
          },
        ],
        success: false,
      });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      findUser.hashedPassword as string,
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Validate error",
        success: false,
        error: [{ field: "password", message: "Incorrect password" }],
      });
    }

    const user: User = {
      ...findUser,
      profileImage: findUser.profileImage?.url,
      address: findUser.locations,
    };

    // populate the session — express-session persists this to the session
    // table and sets the cookie on the response automatically
    req.session.user = { id: user.id, role: user.role };

    // "remember me" — extend this session's cookie lifetime specifically
    if (rememberMe) {
      req.session.cookie.maxAge = getSessionDuration(findUser.role, rememberMe);
    }

    return res.status(200).json({
      message: "login successfully",
      success: true,
      data: user,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

//register controller

export const register = async (
  req: Request<{}, {}, RegisterRequestPayload>,
  res: Response<ApiResponse<RegisterResponsePayload>>,
  next: NextFunction,
) => {
  const CODE_EXPIRY = new Date(Date.now() + 5 * 60 * 1000);
  try {
    const { firstName, lastName, phoneNumber, password, email } = req.body;
    console.log(
      "the fields recieved are ",
      firstName,
      lastName,
      phoneNumber,
      password,
      email,
    );
    // 1. Check if a user exists by either email OR phone number
    const findUser = await prisma.user.findFirst({
      where: {
        OR: [
          phoneNumber ? { phoneNumber } : undefined,
          email ? { email } : undefined,
        ].filter(Boolean) as { phoneNumber?: string; email?: string }[],
      },
    });

    //if user exists
    if (findUser) {
      const emailTaken = findUser.email === email;
      const phoneTaken = findUser.phoneNumber === phoneNumber;
      const errors = [
        emailTaken && {
          field: "email",
          message: "Email already taken. Please sign in instead",
        },
        phoneTaken && {
          field: "phoneNumber",
          message: "Phone number already taken. Please sign in instead",
        },
      ].filter((e): e is { field: string; message: string } => Boolean(e));
      return res.status(400).json({
        message: "An account already exists",
        error: errors,
        success: false,
      });
    }

    //if account doesn't exist sign them up
    const code = getOtp();
    const codeHashed = await bcrypt.hash(code, 10);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        hashedPassword,
        ...(phoneNumber && { phoneNumber }),
        ...(email && { email }),
      },
      select: { id: true },
    });

    //create the code model and save code
    await prisma.otp.create({
      data: {
        codeHash: codeHashed,
        userId: user.id,
        expiresAt: CODE_EXPIRY,
        purpose: "SIGN_UP",
        ...(phoneNumber && { phoneNumber }),
        ...(email && { email }),
      },
    });
    if (!user)
      return res.status(500).json({
        message: "Something went wrong. Please try again",
        success: false,
      });

    console.log("the otp sent is ", code);
    if (phoneNumber) {
      await sendSMSOtp(phoneNumber, code);
    } else if (email) {
      await sendEmailOtp(email, code);
    }

    return res.status(200).json({
      message: "Account created successfully",
      data: { id: user.id },
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

//verify registration controller
const ATTEMPTS_LIMIT = 8;
export const verify = async (
  req: Request<{}, {}, VerifyRequestPayload>,
  res: Response<ApiResponse<VerifyResponsePayload>>,
  next: NextFunction,
) => {
  try {
    const { code, id } = req.body;

    // find the user
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        email: true,
        role: true,
        phoneVerified: true,
        profileImage: { select: { url: true } },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Account not found",
        success: false,
        error: [{ field: "general", message: "Account not found" }],
      });
    }

    // find the most recent unused SIGN_UP otp for this user
    const otp = await prisma.otp.findFirst({
      where: {
        userId: id,
        purpose: "SIGN_UP",
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) {
      return res.status(400).json({
        message: "OTP expired or already used",
        success: false,
        error: [
          {
            field: "code",
            message: "OTP expired or already used. Request a new one",
          },
        ],
      });
    }

    // check attempt limit
    if (otp.attempts >= ATTEMPTS_LIMIT) {
      return res.status(400).json({
        message: "Too many attempts",
        success: false,
        error: [
          {
            field: "code",
            message: "Too many incorrect attepmts. Request a new OTP",
          },
        ],
      });
    }

    // verify the code
    const isCodeCorrect = await bcrypt.compare(code, otp.codeHash);

    if (!isCodeCorrect) {
      // increment attempts on failure
      await prisma.otp.update({
        where: { id: otp.id },
        data: { attempts: { increment: 1 } },
      });
      return res.status(400).json({
        message: `Incorrect code`,
        success: false,
        error: [
          {
            field: "code",
            message: `Incorrect code. Please check the code sent`,
          },
        ],
      });
    }

    // mark otp as used + mark user phone as verified — in one transaction
    const [, updatedUser] = await prisma.$transaction([
      prisma.otp.update({
        where: { id: otp.id },
        data: { verified: true },
      }),
      prisma.user.update({
        where: { id },
        data: { phoneVerified: true },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          email: true,
          role: true,
          profileImage: { select: { url: true } },
          locations: {
            select: {
              isDefault: true,
              neighborhood: true,
              label: true,
              city: true,
              address: true,
            },
          },
        },
      }),
    ]);

    // populate the session — no manual cookie or Prisma session row needed
    req.session.user = {
      id: updatedUser.id,

      role: updatedUser.role,
    };

    return res.status(200).json({
      message: "Phone number verified successfully",
      success: true,
      data: {
        ...updatedUser,
        profileImage: updatedUser.profileImage?.url,
        address: updatedUser.locations,
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

//oAuth login and sign up set up
export const googleRedirect = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["profile", "email"],
    });
    res.redirect(url);
  } catch (err) {
    next(err);
  }
};

export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(
        `${process.env.NEXT_APP_URL}/signin?error=oauth_failed`,
      );
    }

    //  exchange the code Google sent back for actual tokens
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    // use those tokens to fetch the user's Google profile
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: profile } = await oauth2.userinfo.get();

    const {
      id: googleId,
      email,
      given_name: firstName,
      family_name: lastName,
    } = profile;

    if (!googleId || !email) {
      return res.redirect(
        `${process.env.NEXT_APP_URL}/signin?error=oauth_missing_data`,
      );
    }

    //check if this Google account is already linked in Provider table
    const existingProvider = await prisma.provider.findFirst({
      where: {
        providerId: googleId,
        name: "GOOGLE",
      },
      include: { user: true },
    });

    let userId: string;
    let role: Role = "CUSTOMER";

    if (existingProvider) {
      // returning Google user — no need to create anything, just start a session
      userId = existingProvider.userId;
    } else {
      // not seen this Google account before — check if email matches an existing account
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { role: true, id: true },
      });

      if (existingUser) {
        // email already exists (they signed up with phone or email before)
        // just link this Google account to their existing User
        role = existingUser.role;
        await prisma.provider.create({
          data: {
            name: "GOOGLE",
            providerId: googleId,
            email,
            userId: existingUser.id,
          },
        });
        userId = existingUser.id;
      } else {
        // completely new user — create User + Provider together in a transaction
        const result = await prisma.$transaction(async (tx) => {
          const newUser = await tx.user.create({
            data: {
              email,
              emailVerified: true, // Google already verified it
              firstName: firstName ?? "",
              lastName: lastName ?? "",
            },
          });

          await tx.provider.create({
            data: {
              name: "GOOGLE",
              providerId: googleId,
              email,
              userId: newUser.id,
            },
          });

          return newUser;
        });

        userId = result.id;
      }
    }

    // create a session for whoever just logged in
    req.session.user = { id: userId, role };

    //redirect back to the Next.js app using user role
    return res.redirect(
      `${process.env.NEXT_APP_URL}/${role === "ADMIN" ? "admin-home" : role === "STAFF" ? "staff-home" : "user-home"}`,
    );
  } catch (err) {
    next(err);
  }
};

// resend otp controller
export const resendOtp = async (
  req: Request<{}, {}, { id: string }>,
  res: Response<ApiResponse<{ id: string }>>,
  next: NextFunction,
) => {
  try {
    const { id } = req.body;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, phoneNumber: true, email: true },
    });

    if (!user) {
      return res.status(404).json({
        message: "Account not found",
        success: false,
        error: [{ field: "general", message: "Account not found" }],
      });
    }

    // invalidate all existing unused SIGN_UP otps for this user
    await prisma.otp.updateMany({
      where: {
        userId: id,
        purpose: "SIGN_UP",
        verified: false,
        expiresAt: { gt: new Date() },
      },
      data: { expiresAt: new Date() }, // expire them immediately
    });

    // generate new otp
    const code = getOtp();
    const codeHashed = await bcrypt.hash(code, 10);
    const CODE_EXPIRY = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.otp.create({
      data: {
        codeHash: codeHashed,
        userId: id,
        expiresAt: CODE_EXPIRY,
        purpose: "SIGN_UP",
        ...(user.phoneNumber && { phoneNumber: user.phoneNumber }),
        ...(user.email && { email: user.email }),
      },
    });

    if (user.phoneNumber) {
      await sendSMSOtp(user.phoneNumber, code);
    } else if (user.email) {
      await sendEmailOtp(user.email, code);
    }

    return res.status(200).json({
      message: "OTP resent successfully",
      success: true,
      data: { id },
    });
  } catch (err) {
    next(err);
  }
};

//validate session
export const validateSession = async (
  req: Request,
  res: Response<ApiResponse<{ id: string; role: Role }>>,
  next: NextFunction,
) => {
  try {
    if (!req.session.user?.id) {
      return res.status(401).json({
        message: "No session found",
        success: false,
        error: [{ field: "general", message: "Unauthorized" }],
      });
    }

    return res.status(200).json({
      message: "Session valid",
      success: true,
      data: {
        id: req.session.user.id,
        role: req.session.user.role as Role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// get current user
export const getMe = async (
  req: Request,
  res: Response<ApiResponse<User>>,
  next: NextFunction,
) => {
  try {
    if (!req.session.user?.id) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        error: [{ field: "general", message: "No session found" }],
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.session.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        profileImage: { select: { url: true } },
        locations: {
          select: {
            address: true,
            city: true,
            neighborhood: true,
            isDefault: true,
            label: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        error: [{ field: "general", message: "User not found" }],
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      success: true,
      data: {
        ...user,
        profileImage: user.profileImage?.url,
        address: user.locations,
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

//get users addres from apis
export const getLocation = async (
  req: Request,
  res: Response<ApiResponse<LocationResponsePayload>>,
  next: NextFunction,
) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const rawLat = req.query.lat;
    const rawLng = req.query.lng;

    let lat: number | null =
      typeof rawLat === "string" && rawLat.trim() !== ""
        ? Number(rawLat)
        : null;
    let lng: number | null =
      typeof rawLng === "string" && rawLng.trim() !== ""
        ? Number(rawLng)
        : null;

    let source: "GPS" | "IP" = "GPS";

    if (
      lat === null ||
      lng === null ||
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    ) {
      source = "IP";

      const forwardedFor = req.headers["x-forwarded-for"];
      const ip =
        (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)
          ?.split(",")[0]
          .trim() || req.ip;

      const ipRes = await fetch(`https://ipwho.is/${ip}`);
      const ipData = await ipRes.json();

      if (!ipData.success) {
        return res.status(404).json({
          success: false,
          message: "Could not determine location",
          error: [{ message: "location data not found", field: "location" }],
        });
      }

      lat = Number(ipData.latitude);
      lng = Number(ipData.longitude);
    }

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          "User-Agent": "YesLaundryApp/1.0 (yeslaundrygh@gmail.com)",
        },
      },
    );
    const geoData = await geoRes.json();
    const addr = geoData.address ?? {};
    const address = geoData.display_name ?? null;
    const city = addr.city ?? addr.town ?? addr.county ?? null;
    const neighborhood =
      addr.suburb ?? addr.neighbourhood ?? addr.quarter ?? null;

    await prisma.location.create({
      data: {
        userId,
        longitude: lng,
        latitude: lat,
        address,
        neighborhood,
        city,
        isDefault: true,
        source,
      },
    });

    return res.json({
      message: "User location set",
      success: true,
      data: {
        address,
        city,
        neighborhood,
      },
    });
  } catch (err) {
    next(err);
  }
};

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 1,
): Promise<globalThis.Response> {
  try {
    return await fetch(url, { ...options, signal: AbortSignal.timeout(5000) });
  } catch (err) {
    if (retries > 0) {
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

export const setManualLocation = async (
  req: Request<{}, {}, LocationRequestPayload>,
  res: Response<ApiResponse<LocationResponsePayload>>,
  next: NextFunction,
) => {
  try {
    console.log("the end point is reached");
    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { label, address, isDefault } = req.body;

    if (!address || typeof address !== "string" || !address.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Address is required" });
    }

    // Just save if it fails don't blocks the save if it fails
    let latitude: number | null = null;
    let longitude: number | null = null;
    let resolvedCity: string | null = null;
    let resolvedNeighborhood: string | null = null;

    try {
      const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address,
      )}&format=json&addressdetails=1&countrycodes=gh&limit=1`;

      const geoRes = await fetchWithRetry(searchUrl, {
        headers: { "User-Agent": "YesLaundry/1.0 (yeslaundrygh@gmail.com)" },
      });
      const geoData = await geoRes.json();
      const match = geoData?.[0];

      console.log("what is returned is ", geoData);

      if (match) {
        latitude = Number(match.lat);
        longitude = Number(match.lon);
        const addr = match.address ?? {};
        resolvedCity = addr.city ?? addr.town ?? addr.county ?? null;
        resolvedNeighborhood =
          addr.suburb ?? addr.neighbourhood ?? addr.quarter ?? null;
      }
    } catch (geoErr) {
      console.warn("Forward geocode failed for manual address:", geoErr);
    }

    // If this location is default unset any already existing one
    if (isDefault) {
      await prisma.location.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const location = await prisma.location.create({
      data: {
        userId,
        label: label ?? null,
        address: address.trim(),
        city: resolvedCity,
        neighborhood: resolvedNeighborhood,
        latitude,
        longitude,
        isDefault: Boolean(isDefault),
        source: "MANUAL",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Location saved",
      data: {
        address: location.address,
        city: location.city,
        neighborhood: location.neighborhood,
      },
    });
  } catch (err) {
    next(err);
  }
};
