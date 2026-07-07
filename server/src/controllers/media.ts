import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { uploadToCloudinary } from "../lib/cloudary";
import { getMediaType } from "../helpers/mediaType";
import { ServiceMediaType } from "../generated/prisma/enums";
import { ApiResponse } from "./types/auth.response";
import { ImageType } from "./types/service";

function parseServiceMediaType(input: unknown): ServiceMediaType {
  const value = Array.isArray(input) ? input[0] : input;

  if (value === "COVER_IMAGE" || value === "WORK") {
    return value;
  }

  return "WORK";
}

export const uploadServiceMedia = async (
  req: Request,
  res: Response<ApiResponse<ImageType[]>>,
  next: NextFunction,
) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const { serviceId } = req.params;
    const mediaType = parseServiceMediaType(req.body.type);

    if (typeof serviceId !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid serviceId" });
    }

    const uploads = await Promise.all(
      files.map(async (file) => {
        const result = await uploadToCloudinary(
          file.buffer,
          "yes-laundry/services",
        );

        const media = await prisma.media.create({
          data: {
            url: result.secure_url,
            type: getMediaType(file.mimetype),
            mimeType: file.mimetype,
            size: String(file.size),
          },
        });

        const serviceMedia = await prisma.serviceMedia.create({
          data: {
            mediaId: media.id,
            serviceId,
            type: mediaType,
          },
        });

        return {
          url: media.url,
          type: media.type,
          size: media.size,
          mimeType: media.mimeType,
        };
      }),
    );

    res
      .status(201)
      .json({ success: true, data: uploads, message: "Uploaded successfully" });
  } catch (err) {
    next(err);
  }
};

export const uploadServiceCoverImage = async (
  req: Request,
  res: Response<ApiResponse<ImageType>>,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const { serviceId } = req.params;
    const type = "COVER_IMAGE";

    if (typeof serviceId !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid serviceId" });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "yes-laundry/services",
    );

    const media = await prisma.media.create({
      data: {
        url: result.secure_url,
        type: getMediaType(req.file.mimetype),
        mimeType: req.file.mimetype,
        size: String(req.file.size),
      },
    });

    const serviceMedia = await prisma.serviceMedia.create({
      data: {
        mediaId: media.id,
        serviceId,
        type: type,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        url: media.url,
        mimeType: media.mimeType,
        type: media.type,
        size: media.size,
      },
      message: "Uploaded successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const uploadProfileImage = async (
  req: Request,
  res: Response<ApiResponse<ImageType>>,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const userId = req.session.user?.id;
    const { type } = req.body;

    const result = await uploadToCloudinary(
      req.file.buffer,
      "yes-laundry/services",
    );

    const media = await prisma.media.create({
      data: {
        url: result.secure_url,
        type: getMediaType(req.file.mimetype),
        mimeType: req.file.mimetype,
        size: String(req.file.size),
      },
    });

    const serviceMedia = await prisma.user.update({
      where: { id: userId },
      data: { profileImageId: media.id },
    });

    res.status(201).json({
      success: true,
      data: {
        url: media.url,
        mimeType: media.mimeType,
        type: media.type,
        size: media.size,
      },
      message: "Uploaded successfully",
    });
  } catch (err) {
    next(err);
  }
};
