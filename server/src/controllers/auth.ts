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

export const signin = async (
  req: Request<{}, {}, LoginRequestPayload>,
  res: Response<ApiResponse<LoginResponsePayload>>,
  next: NextFunction,
) => {
  try {
    console.log("method reaching server");
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

    // create a session and set the cookie — same as signin
    const sessionExpiresAt = getSessionDuration(findUser.role, rememberMe);
    const session = await prisma.session.create({
      data: {
        userId: findUser.id,
        expiresAt: new Date(Date.now() + sessionExpiresAt),
      },
    });

    res.cookie("session_id", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: sessionExpiresAt,
    });
    const user: User = {
      ...findUser,
      profileImage: findUser.profileImage?.url,
    };
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

    console.log("phoneNumber:", phoneNumber, "email:", email);
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
            message: `Incorrect code. ${ATTEMPTS_LIMIT - otp.attempts - 1} attempts remaining`,
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
        },
      }),
    ]);

    // create a session and set the cookie — same as signin
    const sessionExpiresAt = getSessionDuration("CUSTOMER");
    const session = await prisma.session.create({
      data: {
        userId: id,
        expiresAt: new Date(Date.now() + sessionExpiresAt),
      },
    });

    res.cookie("session_id", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: sessionExpiresAt,
    });

    return res.status(200).json({
      message: "Phone number verified successfully",
      success: true,
      data: {
        ...updatedUser,
        profileImage: updatedUser.profileImage?.url,
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
    const session = await prisma.session.create({
      data: {
        userId,
        expiresAt: new Date(Date.now() + SESSION_DURATION.DEFAULT),
      },
    });

    //set the session cookie
    res.cookie("session_id", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: SESSION_DURATION.DEFAULT,
    });

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
    const sessionId = req.cookies["session_id"];

    if (!sessionId) {
      return res.status(401).json({
        message: "No session found",
        success: false,
        error: [{ field: "general", message: "Unauthorized" }],
      });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        expiresAt: true,
        user: {
          select: { id: true, role: true },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({
        message: "Session expired or invalid",
        success: false,
        error: [{ field: "general", message: "Unauthorized" }],
      });
    }

    return res.status(200).json({
      message: "Session valid",
      success: true,
      data: {
        id: session.user.id,
        role: session.user.role,
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
    const sessionId = req.cookies["session_id"];
    console.log("getMe called on server");

    if (!sessionId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        error: [{ field: "general", message: "No session found" }],
      });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        expiresAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            role: true,
            profileImage: { select: { url: true } },
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({
        message: "Session expired or invalid",
        success: false,
        error: [{ field: "general", message: "Unauthorized" }],
      });
    }

    const user: User = {
      ...session.user,
      profileImage: session.user.profileImage?.url,
    };

    return res.status(200).json({
      message: "User fetched successfully",
      success: true,
      data: user,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
