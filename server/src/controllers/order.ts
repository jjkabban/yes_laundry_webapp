import { Router, Request, Response, NextFunction } from "express";
import { ApiResponse } from "./types/auth.response";
import {
  Order,
  OrderDraft,
  OrderDraftItemEntry,
  UserOrderResponsePayload,
} from "./types/order";
import { prisma } from "../lib/prisma";

function serializeOrder(raw: any): Order {
  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    customerId: raw.customerId,
    customer: raw.customer,
    assignedStaffId: raw.assignedStaffId,
    assignedStaff: raw.assignedStaff,
    serviceId: raw.serviceId,
    service: raw.service
      ? {
          id: raw.service.id,
          name: raw.service.title,
          priceModel: raw.service.priceModel,
          icon: raw.service.icon,
        }
      : undefined,
    status: raw.status,
    bagCount: raw.bagCount,
    weightKg: raw.weightKg !== null ? Number(raw.weightKg) : null,
    items: raw.items.map((item: any) => ({
      id: item.id,
      orderId: item.orderId,
      serviceItemId: item.serviceItemId,
      quantity: item.quantity,
      unitPriceAtOrder: Number(item.unitPriceAtOrder),
      notes: item.notes,
      serviceItem: item.serviceItem
        ? {
            id: item.serviceItem.id,
            unitPrice: Number(item.serviceItem.unitPrice),
            item: item.serviceItem.item,
          }
        : undefined,
    })),
    timeSlot: raw.timeSlot,
    startTime: raw.startTime,
    endTime: raw.endTime,
    recurringOrderId: raw.recurringOrderId,
    pickupAddress: raw.pickupAddress,
    pickupWindow: raw.pickupWindow?.toISOString(),
    pickedUpAt: raw.pickedUpAt ? raw.pickedUpAt.toISOString() : null,
    deliveryAddress: raw.deliveryAddress,
    deliveryWindow: raw.deliveryWindow
      ? raw.deliveryWindow.toISOString()
      : null,
    deliveredAt: raw.deliveredAt ? raw.deliveredAt.toISOString() : null,
    subtotal: Number(raw.subtotal),
    deliveryFee: Number(raw.deliveryFee),
    discount: Number(raw.discount),
    total: Number(raw.total),
    addOns: raw.addOns?.map((addOn: any) => ({
      id: addOn.id,
      orderId: addOn.orderId,
      serviceAddOnId: addOn.serviceAddOnId,
      priceAtOrder: Number(addOn.priceAtOrder),
      quantity: addOn.quantity,
      serviceAddOn: addOn.serviceAddOn,
      createdAt: addOn.createdAt.toISOString(),
      updatedAt: addOn.updatedAt.toISOString(),
    })),
    transactions: raw.transactions?.map((tx: any) => ({
      ...tx,
      amount: Number(tx.amount),
      createdAt: tx.createdAt.toISOString(),
      updatedAt: tx.updatedAt.toISOString(),
    })),
    events: raw.events?.map((event: any) => ({
      ...event,
      createdAt: event.createdAt.toISOString(),
    })),
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  };
}

export const getUserOrders = async (
  req: Request,
  res: Response<ApiResponse<UserOrderResponsePayload>>,
  next: NextFunction,
) => {
  try {
    const userId = req.session.user?.id;
    if (!userId)
      return res
        .status(400)
        .json({ message: "Unathorized request", success: false });

    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        customerId: true,
        assignedStaffId: true,
        serviceId: true,
        status: true,
        bagCount: true,
        weightKg: true,
        timeSlot: true,
        startTime: true,
        endTime: true,
        recurringOrderId: true,
        pickupAddress: true,
        pickupWindow: true,
        pickedUpAt: true,
        deliveryAddress: true,
        deliveryWindow: true,
        deliveredAt: true,
        subtotal: true,
        deliveryFee: true,
        discount: true,
        total: true,
        createdAt: true,
        updatedAt: true,

        service: {
          select: { id: true, title: true, priceModel: true, icon: true },
        },

        assignedStaff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            profileImage: true,
          },
        },

        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            email: true,
            profileImage: true,
          },
        },

        items: {
          select: {
            id: true,
            orderId: true,
            serviceItemId: true,
            quantity: true,
            unitPriceAtOrder: true,
            notes: true,
            serviceItem: {
              select: {
                id: true,
                unitPrice: true,
                item: { select: { name: true } },
              },
            },
          },
        },

        addOns: {
          select: {
            id: true,
            orderId: true,
            serviceAddOnId: true,
            priceAtOrder: true,
            quantity: true,
            createdAt: true,
            updatedAt: true,
            serviceAddOn: {
              select: {
                addOn: {
                  select: { name: true, description: true },
                },
              },
            },
          },
        },

        transactions: true,

        events: {
          select: {
            id: true,
            orderId: true,
            eventType: true,
            status: true,
            workedOnById: true,
            workedOnBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
            triggeredById: true,
            triggeredBy: {
              select: { id: true, firstName: true, lastName: true },
            },
            notes: true,
            metadata: true,
            createdAt: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Orders fetched successfully",
      success: true,
      data: orders.map(serializeOrder),
    });
  } catch (err) {
    next(err);
  }
};

export const getUserOrder = async (
  req: Request,
  res: Response<ApiResponse<Order>>,
  next: NextFunction,
) => {
  try {
    const userId = req.session.user?.id;
    if (!userId)
      return res
        .status(401)
        .json({ message: "Unauthorized request", success: false });

    const { orderId } = req.params;

    if (!orderId || typeof orderId !== "string")
      return res
        .status(400)
        .json({ message: "Invalid order id", success: false });

    const order = await prisma.order.findUnique({
      where: { id: orderId },

      select: {
        id: true,
        orderNumber: true,
        customerId: true,
        assignedStaffId: true,
        serviceId: true,
        status: true,
        bagCount: true,
        weightKg: true,
        timeSlot: true,
        startTime: true,
        endTime: true,
        recurringOrderId: true,
        pickupAddress: true,
        pickupWindow: true,
        pickedUpAt: true,
        deliveryAddress: true,
        deliveryWindow: true,
        deliveredAt: true,
        subtotal: true,
        deliveryFee: true,
        discount: true,
        total: true,
        createdAt: true,
        updatedAt: true,

        service: {
          select: { id: true, title: true, priceModel: true, icon: true },
        },

        assignedStaff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            profileImage: true,
          },
        },

        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            email: true,
            profileImage: true,
          },
        },

        items: {
          select: {
            id: true,
            orderId: true,
            serviceItemId: true,
            quantity: true,
            unitPriceAtOrder: true,
            notes: true,
            serviceItem: {
              select: {
                id: true,
                unitPrice: true,
                item: { select: { name: true } },
              },
            },
          },
        },

        addOns: {
          select: {
            id: true,
            orderId: true,
            serviceAddOnId: true,
            priceAtOrder: true,
            quantity: true,
            createdAt: true,
            updatedAt: true,
            serviceAddOn: {
              select: {
                addOn: { select: { name: true, description: true } },
              },
            },
          },
        },

        transactions: true,

        events: {
          select: {
            id: true,
            orderId: true,
            eventType: true,
            status: true,
            workedOnById: true,
            workedOnBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
            triggeredById: true,
            triggeredBy: {
              select: { id: true, firstName: true, lastName: true },
            },
            notes: true,
            metadata: true,
            createdAt: true,
          },
        },
      },
    });

    if (!order)
      return res
        .status(404)
        .json({ message: "Order not found", success: false });

    if (order.customerId !== userId)
      return res.status(403).json({ message: "Forbidden", success: false });

    return res.status(200).json({
      message: "Order fetched successfully",
      success: true,
      data: serializeOrder(order),
    });
  } catch (err) {
    next(err);
  }
};

async function resolveDraftItems(rawItems: unknown) {
  const entries = (rawItems as OrderDraftItemEntry[] | null) ?? [];
  if (entries.length === 0) return [];

  const serviceItems = await prisma.serviceItem.findMany({
    where: { id: { in: entries.map((e) => e.serviceItemId) } },
    select: {
      id: true,
      unitPrice: true,
      item: { select: { name: true } },
    },
  });

  return entries.map((entry) => {
    const si = serviceItems.find((s) => s.id === entry.serviceItemId);
    return {
      serviceItemId: entry.serviceItemId,
      quantity: entry.quantity,
      notes: entry.notes ?? null,
      unitPrice: si ? Number(si.unitPrice) : null,
      name: si?.item?.name ?? "Unknown item",
    };
  });
}

async function serializeDraft(raw: any): Promise<OrderDraft> {
  return {
    id: raw.id,
    customerId: raw.customerId,
    serviceId: raw.serviceId,
    service: raw.service
      ? {
          id: raw.service.id,
          name: raw.service.title,
          priceModel: raw.service.priceModel,
          icon: raw.service.icon,
        }
      : undefined,
    bagCount: raw.bagCount,
    weightKg: raw.weightKg !== null ? Number(raw.weightKg) : null,
    items: await resolveDraftItems(raw.items),
    addOns: raw.addOns?.map((addOn: any) => ({
      id: addOn.id,
      orderDraftId: addOn.orderDraftId,
      serviceAddOnId: addOn.serviceAddOnId,
      priceAtOrder: Number(addOn.priceAtOrder),
      quantity: addOn.quantity,
      serviceAddOn: addOn.serviceAddOn,
      createdAt: addOn.createdAt.toISOString(),
    })),
    pickupAddress: raw.pickupAddress,
    pickupWindow: raw.pickupWindow ? raw.pickupWindow.toISOString() : null,
    deliveryAddress: raw.deliveryAddress,
    deliveryWindow: raw.deliveryWindow
      ? raw.deliveryWindow.toISOString()
      : null,
    currentStep: raw.currentStep,
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  };
}

const draftSelect = {
  id: true,
  customerId: true,
  serviceId: true,
  bagCount: true,
  weightKg: true,
  items: true,
  pickupAddress: true,
  pickupWindow: true,
  deliveryAddress: true,
  deliveryWindow: true,
  currentStep: true,
  createdAt: true,
  updatedAt: true,
  service: {
    select: { id: true, title: true, priceModel: true, icon: true },
  },
  addOns: {
    select: {
      id: true,
      orderDraftId: true,
      serviceAddOnId: true,
      priceAtOrder: true,
      quantity: true,
      createdAt: true,
      serviceAddOn: {
        select: { addOn: { select: { name: true, description: true } } },
      },
    },
  },
} as const;

export const getUserDraftOrders = async (
  req: Request,
  res: Response<ApiResponse<OrderDraft[]>>,
  next: NextFunction,
) => {
  try {
    const userId = req.session.user?.id;
    if (!userId)
      return res
        .status(401)
        .json({ message: "Unauthorized request", success: false });

    const drafts = await prisma.orderDraft.findMany({
      where: { customerId: userId },
      orderBy: { updatedAt: "desc" },
      select: draftSelect,
    });

    const data = await Promise.all(drafts.map(serializeDraft));

    return res.status(200).json({
      message: "Draft orders fetched successfully",
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserDraftOrder = async (
  req: Request,
  res: Response<ApiResponse<OrderDraft>>,
  next: NextFunction,
) => {
  try {
    const userId = req.session.user?.id;
    if (!userId)
      return res
        .status(401)
        .json({ message: "Unauthorized request", success: false });

    const { draftId } = req.params;
    if (!draftId || typeof draftId !== "string")
      return res
        .status(400)
        .json({ message: "Invalid draft id", success: false });

    const draft = await prisma.orderDraft.findUnique({
      where: { id: draftId },
      select: draftSelect,
    });

    if (!draft)
      return res
        .status(404)
        .json({ message: "Draft not found", success: false });

    if (draft.customerId !== userId)
      return res.status(403).json({ message: "Forbidden", success: false });

    return res.status(200).json({
      message: "Draft order fetched successfully",
      success: true,
      data: await serializeDraft(draft),
    });
  } catch (err) {
    next(err);
  }
};
