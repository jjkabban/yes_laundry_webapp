import Router, { Response, Request, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "./types/auth.response";
import {
  ImageType,
  ServiceResponsePayload,
  ServiceDetail,
} from "./types/service";
import { generateSlug } from "../util/slug";

export const getServices = async (
  req: Request,
  res: Response<ApiResponse<ServiceResponsePayload>>,
  next: NextFunction,
) => {
  try {
    const allServices = await prisma.service.findMany({
      where: { isActive: true },
      select: {
        title: true,
        description: true,
        contextDescription: true,
        coverImage: true,
        turnaroundTime: true,
        basePrice: true,
        icon: true,
        id: true,
        priceModel: true,
      },
    });

    const services = allServices.map((ser) => {
      const slug = generateSlug(ser.title);
      const basePrice = Number(ser.basePrice);
      return { slug, ...ser, basePrice };
    });

    return res.status(200).json({
      message:
        services.length === 0
          ? "No services found"
          : "Services sent successfully",
      data: services,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const getServiceById = async (
  req: Request,
  res: Response<ApiResponse<ServiceDetail | null>>,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ message: "Invalid service id", data: null, success: false });
    }

    const service = await prisma.service.findUnique({
      where: { id },
      select: {
        title: true,
        description: true,
        contextDescription: true,
        coverImage: {
          select: { mimeType: true, type: true, url: true, size: true },
        },
        turnaroundTime: true,
        basePrice: true,
        icon: true,
        id: true,
        priceModel: true,
        serviceMedia: {
          select: {
            media: {
              select: { type: true, url: true, mimeType: true, size: true },
            },
          },
        },
        howItWorks: {
          select: {
            id: true,
            title: true,
            description: true,
            icon: true,
            image: { select: { url: true } },
          },
        },
        policies: {
          select: {
            type: true,
            id: true,
            title: true,
            description: true,
            icon: true,
          },
        },
        inclusions: { select: { id: true, name: true } },
        careAndHandling: {
          select: { id: true, title: true, icon: true, description: true },
        },
      },
    });

    if (!service) {
      return res
        .status(404)
        .json({ message: "No service found", success: false, data: null });
    }

    const slug = generateSlug(service.title);
    const basePrice = Number(service.basePrice);
    const media = service.serviceMedia.map((sm) => sm.media);
    const howItWorks = service.howItWorks.map((step) => ({
      id: step.id,
      title: step.title,
      description: step.description,
      icon: step.icon,
      image: step.image.url,
    }));

    return res.status(200).json({
      message: "Service sent successfully",
      success: true,
      data: {
        id: service.id,
        title: service.title,
        slug,
        description: service.description,
        contextDescription: service.contextDescription,
        coverImage: service.coverImage,
        turnaroundTime: service.turnaroundTime,
        basePrice,
        priceModel: service.priceModel,
        icon: service.icon,
        media,
        howItWorks,
        policies: service.policies,
        handleAndCare: service.careAndHandling,
        includes: service.inclusions,
      },
    });
  } catch (err) {
    next(err);
  }
};
