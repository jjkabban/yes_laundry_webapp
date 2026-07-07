import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { uploadToCloudinary } from "../src/lib/cloudary";
import { getMediaType } from "../src/helpers/mediaType";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

async function uploadSeedImage(relativePath: string, folder: string) {
  const filePath = path.join(__dirname, "seed-assets", relativePath);
  const buffer = fs.readFileSync(filePath);
  const mimeType = relativePath.endsWith(".png") ? "image/png" : "image/jpeg";

  const result = await uploadToCloudinary(buffer, folder);

  return prisma.media.create({
    data: {
      url: result.secure_url,
      type: getMediaType(mimeType),
      mimeType,
      size: String(buffer.length),
    },
  });
}

// ════════════════════════════════════════════════════════════
// SERVICES SEED — must run before orders (orders reference
// Service, ServiceItem, ServiceAddOn, ServiceTimeSlotDefault)
// ════════════════════════════════════════════════════════════
async function seedServices() {
  const hashedPassword = await bcrypt.hash("SeedAdmin123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@yeslaundrygh.com" },
    update: {},
    create: {
      firstName: "Yes",
      lastName: "Admin",
      email: "admin@yeslaundrygh.com",
      hashedPassword,
      role: "ADMIN",
      emailVerified: true,
    },
  });

  // --- TimeSlots ---
  const slotDefs: {
    name: "MORNING" | "AFTERNOON" | "EVENING";
    label: string;
    startTime: string;
    endTime: string;
  }[] = [
    {
      name: "MORNING",
      label: "Morning (8:00 - 11:00)",
      startTime: "08:00",
      endTime: "11:00",
    },
    {
      name: "AFTERNOON",
      label: "Afternoon (13:00 - 16:00)",
      startTime: "13:00",
      endTime: "16:00",
    },
    {
      name: "EVENING",
      label: "Evening (17:00 - 19:00)",
      startTime: "17:00",
      endTime: "19:00",
    },
  ];

  const timeSlots = await Promise.all(
    slotDefs.map(async (def) => {
      const existing = await prisma.timeSlot.findFirst({
        where: { name: def.name },
      });
      if (existing) return existing;
      return prisma.timeSlot.create({ data: def });
    }),
  );

  // --- Item categories + items ---
  const category = await prisma.itemCategory.upsert({
    where: { name: "General" },
    update: {},
    create: { name: "General", description: "Everyday garments" },
  });

  const itemNames = [
    "Shirt",
    "Trousers",
    "Dress",
    "Bedsheet",
    "Suit",
    "Jacket",
  ];
  const items = await Promise.all(
    itemNames.map(async (name) => {
      const existing = await prisma.item.findFirst({ where: { name } });
      if (existing) return existing;
      return prisma.item.create({ data: { name, categoryId: category.id } });
    }),
  );

  // --- Add-ons ---
  const addOnDefs = [
    {
      name: "Express Turnaround",
      description: "Cut turnaround time in half",
      basePrice: 15,
    },
    {
      name: "Eco-Friendly Detergent",
      description: "Biodegradable, skin-safe detergent",
      basePrice: 5,
    },
  ];

  const addOns = await Promise.all(
    addOnDefs.map(async (def) => {
      const existing = await prisma.addOn.findFirst({
        where: { name: def.name },
      });
      if (existing) return existing;
      return prisma.addOn.create({ data: def });
    }),
  );

  const policyDefs: {
    type:
      | "CANCELLATION"
      | "DAMAGED_AND_LOST_ITEMS"
      | "SPECIAL_CARE_ITEMS"
      | "REWASH_GUARANTEE";
    title: string;
    description: string;
    icon: string;
  }[] = [
    {
      type: "CANCELLATION",
      title: "Cancellation",
      description:
        "Free cancellation up to 2 hours before your scheduled pickup.",
      icon: "ShieldAlert",
    },
    {
      type: "DAMAGED_AND_LOST_ITEMS",
      title: "Damaged and lost items",
      description:
        "We compensate for any item lost or damaged while in our care.",
      icon: "ShieldAlert",
    },
    {
      type: "SPECIAL_CARE_ITEMS",
      title: "Special items care",
      description:
        "Delicate or special-care items are cleaned separately by hand where needed.",
      icon: "Sparkles",
    },
    {
      type: "REWASH_GUARANTEE",
      title: "Rewash guarantee",
      description:
        "Not satisfied with a clean? We'll rewash it for free within 48 hours.",
      icon: "RefreshCw",
    },
  ];

  const policies = await Promise.all(
    policyDefs.map(async (def) => {
      const existing = await prisma.policy.findFirst({
        where: { title: def.title },
      });
      if (existing) return existing;
      return prisma.policy.create({ data: def });
    }),
  );

  // --- Inclusions (shared, m2m with Service) ---
  const inclusionNames = [
    "Washing with premium detergent",
    "Professional folding of each item",
    "Free pickup & delivery to your door",
    "Garment-by-garment sorting by colour",
    "Packaged in reusable laundry bags",
  ];

  const inclusions = await Promise.all(
    inclusionNames.map(async (name) => {
      const existing = await prisma.inclusions.findFirst({ where: { name } });
      if (existing) return existing;
      return prisma.inclusions.create({ data: { name } });
    }),
  );

  // --- Care & Handling (shared, m2m with Service) ---
  const careDefs = [
    {
      title: "Gentle Wash",
      description: "Soft wash cycles for delicate fabrics",
      icon: "Shirt",
    },
    {
      title: "Fabric Separation",
      description: "We separate whites, colors, and darks",
      icon: "Layers",
    },
    {
      title: "No Harsh Chemicals",
      description: "No bleach on colored or sensitive items",
      icon: "Ban",
    },
    {
      title: "Careful Cleaning",
      description: "Professionally cleaned with fabric safety in mind",
      icon: "Droplet",
    },
    {
      title: "Handled with Care",
      description: "Every item is checked during pickup and delivery",
      icon: "PackageCheck",
    },
  ];

  const careAndHandlingItems = await Promise.all(
    careDefs.map(async (def) => {
      const existing = await prisma.careAndHandling.findFirst({
        where: { title: def.title },
      });
      if (existing) return existing;
      return prisma.careAndHandling.create({ data: def });
    }),
  );

  // --- How It Works steps (shared template, own image per step) ---
  const howItWorksDefs = [
    {
      title: "We collect your clothes",
      description:
        "Our driver arrives at your scheduled pickup window and collects your laundry bag.",
      icon: "Truck",
      image: "how-it-works/step-1.jpg",
    },
    {
      title: "Sort & inspect",
      description:
        "We sort your items by colour and fabric type, and check for any special care labels.",
      icon: "Shirt",
      image: "how-it-works/step-2.jpg",
    },
    {
      title: "Wash & fold",
      description:
        "Each load is washed at the right temperature, dried, and neatly folded by our team.",
      icon: "WashingMachine",
      image: "how-it-works/step-3.jpg",
    },
    {
      title: "Delivered to your door",
      description:
        "Your fresh laundry is packaged and returned within 24–48 hours of pickup.",
      icon: "Building2",
      image: "how-it-works/step-4.jpg",
    },
  ];

  // --- Services ---
  const serviceDefs = [
    {
      title: "Stain Removal",
      description:
        "Professional treatment for tough stains — oil, wine, ink, and more. Each item is assessed and treated individually before washing.",
      contextDescription: "Tough stains removed with expert care.",
      turnaroundTime: "2 days",
      basePrice: 25,
      priceModel: "PER_ITEM" as const,
      icon: "Droplets",
      coverImage: "services/stain-removal-cover.jpg",
    },
    {
      title: "Dry Cleaning",
      description:
        "Solvent-based cleaning for delicate fabrics — suits, dresses, silk, and wool that can't be machine washed.",
      contextDescription: "Premium care for delicate garments.",
      turnaroundTime: "3 days",
      basePrice: 55,
      priceModel: "PER_ITEM" as const,
      icon: "Shirt",
      coverImage: "services/dry-cleaning-cover.jpg",
    },
    {
      title: "Ironing / Pressing",
      description:
        "Crisp, wrinkle-free results for everyday wear and formal items. Garments are steamed and pressed to a professional finish.",
      contextDescription: "Perfectly pressed and wrinkle-free.",
      turnaroundTime: "Next day",
      basePrice: 15,
      priceModel: "PER_ITEM" as const,
      icon: "Flame",
      coverImage: "services/ironing-cover.jpg",
    },
    {
      title: "Personal Laundry",
      description:
        "Wash, dry, and fold service for everyday clothing. Sorted by colour, washed at the right temperature, and neatly folded.",
      contextDescription: "Fresh, clean clothes without the hassle.",
      turnaroundTime: "Next day",
      basePrice: 8,
      priceModel: "BY_WEIGHT" as const,
      icon: "WashingMachine",
      coverImage: "services/personal-laundry-cover.jpg",
    },
    {
      title: "Commercial Laundry",
      description:
        "Bulk laundry for businesses — hotels, restaurants, salons, and offices. High-volume washing with consistent quality and fast turnaround.",
      contextDescription: "Reliable laundry solutions for businesses.",
      turnaroundTime: "2 days",
      basePrice: 120,
      priceModel: "PER_BAG" as const,
      icon: "Building2",
      coverImage: "services/commercial-laundry-cover.jpg",
    },
  ];

  // Upload How It Works images once — shared across every service
  const howItWorksImages = await Promise.all(
    howItWorksDefs.map((step) =>
      uploadSeedImage(step.image, "yes-laundry/how-it-works"),
    ),
  );

  for (const def of serviceDefs) {
    const existingService = await prisma.service.findFirst({
      where: { title: def.title },
    });
    if (existingService) {
      console.log(`Skipped (already exists): ${def.title}`);
      continue;
    }

    const availability = await prisma.serviceAvailability.create({
      data: { windowDays: 90, blockedDays: [0], blockedDates: [] },
    });

    // Upload cover image FIRST — coverImageId is a required, unique FK on Service
    const coverMedia = await uploadSeedImage(
      def.coverImage,
      "yes-laundry/services",
    );

    const service = await prisma.service.create({
      data: {
        title: def.title,
        description: def.description,
        contextDescription: def.contextDescription,
        turnaroundTime: def.turnaroundTime,
        basePrice: def.basePrice,
        priceModel: def.priceModel,
        icon: def.icon,
        isActive: true,
        createdById: admin.id,
        updatedById: admin.id,
        availabilityId: availability.id,
        coverImageId: coverMedia.id, // direct FK — no ServiceMedia row for the cover
        policies: { connect: policies.map((p) => ({ id: p.id })) },
        inclusions: { connect: inclusions.map((i) => ({ id: i.id })) },
        careAndHandling: {
          connect: careAndHandlingItems.map((c) => ({ id: c.id })),
        },
      },
    });

    // How It Works steps — reuse the already-uploaded images
    await Promise.all(
      howItWorksDefs.map((step, i) =>
        prisma.howItWorks.create({
          data: {
            title: step.title,
            description: step.description,
            icon: step.icon,
            imageId: howItWorksImages[i].id,
            serviceId: service.id,
          },
        }),
      ),
    );

    // Linked items
    const linkedItems = items.slice(0, 3);
    await Promise.all(
      linkedItems.map((item) =>
        prisma.serviceItem.create({
          data: {
            serviceId: service.id,
            itemId: item.id,
            unitPrice: def.basePrice,
          },
        }),
      ),
    );

    // Add-ons
    await Promise.all(
      addOns.map((addOn) =>
        prisma.serviceAddOn.create({
          data: {
            serviceId: service.id,
            addOnId: addOn.id,
            price: addOn.basePrice,
          },
        }),
      ),
    );

    // Time slots
    const slotsToAttach = timeSlots.filter(
      (s) => s.name === "MORNING" || s.name === "AFTERNOON",
    );
    await Promise.all(
      slotsToAttach.map((slot) =>
        prisma.serviceTimeSlotDefault.create({
          data: {
            serviceId: service.id,
            timeSlotId: slot.id,
            startTime: slot.startTime,
            endTime: slot.endTime,
          },
        }),
      ),
    );

    console.log(`Seeded: ${def.title}`);
  }

  console.log("Services seed complete ✅");
}

// ════════════════════════════════════════════════════════════
// ORDERS SEED — runs after services (depends on Service,
// ServiceItem, ServiceAddOn, ServiceTimeSlotDefault existing)
// ════════════════════════════════════════════════════════════
async function seedOrders() {
  // ── Test customer + staff ──────────────────────────────────
  const customerPassword = await bcrypt.hash("TestCustomer123!", 10);
  const customer = await prisma.user.upsert({
    where: { email: "customer.test@yeslaundrygh.com" },
    update: {},
    create: {
      firstName: "Ama",
      lastName: "Owusu",
      email: "customer.test@yeslaundrygh.com",
      phoneNumber: "0241234567",
      hashedPassword: customerPassword,
      role: "CUSTOMER",
      emailVerified: true,
      phoneVerified: true,
    },
  });

  const staffPassword = await bcrypt.hash("TestStaff123!", 10);
  const staff = await prisma.user.upsert({
    where: { email: "staff.test@yeslaundrygh.com" },
    update: {},
    create: {
      firstName: "Kwame",
      lastName: "Mensah",
      email: "staff.test@yeslaundrygh.com",
      phoneNumber: "0551234567",
      hashedPassword: staffPassword,
      role: "STAFF",
      emailVerified: true,
      phoneVerified: true,
    },
  });

  // ── Pull an existing seeded service + its items/add-ons/slots ──
  const service = await prisma.service.findFirst({
    where: { title: "Stain Removal" },
    include: {
      items: { include: { item: true }, take: 2 },
      addOns: { include: { addOn: true } },
      timeSlotDefaults: { include: { timeSlot: true } },
    },
  });

  if (!service) {
    throw new Error(
      "No 'Stain Removal' service found — services seed must run first.",
    );
  }

  const morningSlot = service.timeSlotDefaults.find(
    (s) => s.timeSlot.name === "MORNING",
  );

  if (!morningSlot) {
    throw new Error("No MORNING time slot default found on this service.");
  }

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const buildOrderItems = () =>
    service.items.map((si) => ({
      serviceItemId: si.id,
      quantity: 2,
      unitPriceAtOrder: si.unitPrice,
      notes: null,
    }));

  const addOnToAttach = service.addOns[0]; // first ServiceAddOn row, for testing

  // ══════════════════════════════════════════════════════════
  // 1. LIVE order — IN_PROGRESS
  // ══════════════════════════════════════════════════════════
  const liveOrder = await prisma.order.create({
    data: {
      orderNumber: "YL-TEST-001",
      customerId: customer.id,
      assignedStaffId: staff.id,
      serviceId: service.id,
      status: "IN_PROGRESS",
      timeSlot: "MORNING",
      startTime: morningSlot.startTime,
      endTime: morningSlot.endTime,
      pickupAddress: "14 Spintex Road, Accra",
      pickupWindow: new Date(now - day),
      pickedUpAt: new Date(now - day + 1000 * 60 * 30),
      deliveryAddress: "14 Spintex Road, Accra",
      deliveryWindow: new Date(now + 1000 * 60 * 60 * 2),
      subtotal: 60,
      deliveryFee: 5,
      discount: 0,
      total: addOnToAttach ? 60 + 5 + Number(addOnToAttach.price) : 65,
      items: { create: buildOrderItems() },

      transactions: {
        create: {
          amount: 65,
          status: "PENDING",
          method: "MOBILE_MONEY",
          provider: "MTN",
          reference: "MM-TEST-LIVE-001",
        },
      },

      events: {
        create: [
          {
            eventType: "CREATED",
            status: "PENDING",
            workedOnById: staff.id,
            createdAt: new Date(now - day - 1000 * 60 * 60),
          },
          {
            eventType: "CONFIRMED",
            status: "CONFIRMED",
            workedOnById: staff.id,
            createdAt: new Date(now - day - 1000 * 60 * 30),
          },
          {
            eventType: "PICKED_UP",
            status: "PICKED_UP",
            workedOnById: staff.id,
            notes: "Collected from customer's doorstep",
            createdAt: new Date(now - day + 1000 * 60 * 30),
          },
          {
            eventType: "PROCESSING_STARTED",
            status: "IN_PROGRESS",
            workedOnById: staff.id,
            createdAt: new Date(now - 1000 * 60 * 60 * 3),
          },
        ],
      },

      ...(addOnToAttach && {
        addOns: {
          create: {
            serviceAddOnId: addOnToAttach.id,
            priceAtOrder: addOnToAttach.price,
          },
        },
      }),
    },
  });
  console.log(`Seeded LIVE order: ${liveOrder.orderNumber} (${liveOrder.id})`);

  // ══════════════════════════════════════════════════════════
  // 2. DELIVERED order
  // ══════════════════════════════════════════════════════════
  const deliveredAt = new Date(now - day * 2);
  const deliveredOrder = await prisma.order.create({
    data: {
      orderNumber: "YL-TEST-002",
      customerId: customer.id,
      assignedStaffId: staff.id,
      serviceId: service.id,
      status: "DELIVERED",
      timeSlot: "AFTERNOON",
      startTime: "13:00",
      endTime: "16:00",
      pickupAddress: "East Legon, Accra",
      pickupWindow: new Date(now - day * 4),
      pickedUpAt: new Date(now - day * 4 + 1000 * 60 * 20),
      deliveryAddress: "East Legon, Accra",
      deliveryWindow: deliveredAt,
      deliveredAt,
      subtotal: 60,
      deliveryFee: 5,
      discount: 5,
      total: 60,
      items: { create: buildOrderItems() },
      transactions: {
        create: {
          amount: 60,
          status: "PAID",
          method: "MOBILE_MONEY",
          provider: "MTN",
          reference: "MM-TEST-DELIVERED-001",
        },
      },
      events: {
        create: [
          {
            eventType: "CREATED",
            status: "PENDING",
            workedOnById: staff.id,
            createdAt: new Date(now - day * 4 - 1000 * 60 * 60),
          },
          {
            eventType: "CONFIRMED",
            status: "CONFIRMED",
            workedOnById: staff.id,
            createdAt: new Date(now - day * 4 - 1000 * 60 * 30),
          },
          {
            eventType: "PICKED_UP",
            status: "PICKED_UP",
            workedOnById: staff.id,
            createdAt: new Date(now - day * 4 + 1000 * 60 * 20),
          },
          {
            eventType: "PROCESSING_STARTED",
            status: "IN_PROGRESS",
            workedOnById: staff.id,
            createdAt: new Date(now - day * 3),
          },
          {
            eventType: "READY",
            status: "READY",
            workedOnById: staff.id,
            createdAt: new Date(now - day * 2 - 1000 * 60 * 60 * 5),
          },
          {
            eventType: "OUT_FOR_DELIVERY",
            status: "OUT_FOR_DELIVERY",
            workedOnById: staff.id,
            createdAt: new Date(now - day * 2 - 1000 * 60 * 60),
          },
          {
            eventType: "DELIVERED",
            status: "DELIVERED",
            workedOnById: staff.id,
            notes: "Delivered and signed for by customer",
            createdAt: deliveredAt,
          },
        ],
      },
    },
  });
  console.log(
    `Seeded DELIVERED order: ${deliveredOrder.orderNumber} (${deliveredOrder.id})`,
  );

  // ══════════════════════════════════════════════════════════
  // 3. CANCELLED order
  // ══════════════════════════════════════════════════════════
  const cancelledOrder = await prisma.order.create({
    data: {
      orderNumber: "YL-TEST-003",
      customerId: customer.id,
      serviceId: service.id,
      status: "CANCELLED",
      timeSlot: "EVENING",
      startTime: "17:00",
      endTime: "19:00",
      pickupAddress: "Cantonments, Accra",
      pickupWindow: new Date(now + day),
      deliveryAddress: "Cantonments, Accra",
      subtotal: 60,
      deliveryFee: 5,
      discount: 0,
      total: 65,
      items: { create: buildOrderItems() },
      transactions: {
        create: {
          amount: 65,
          status: "REFUNDED",
          method: "MOBILE_MONEY",
          provider: "MTN",
          reference: "MM-TEST-CANCELLED-001",
          failureReason: null,
        },
      },
      events: {
        create: [
          {
            eventType: "CREATED",
            status: "PENDING",
            workedOnById: staff.id,
            createdAt: new Date(now - 1000 * 60 * 60 * 5),
          },
          {
            eventType: "CANCELLED",
            status: "CANCELLED",
            workedOnById: staff.id,
            notes: "Customer requested cancellation — schedule conflict",
            createdAt: new Date(now - 1000 * 60 * 30),
          },
        ],
      },
    },
  });
  console.log(
    `Seeded CANCELLED order: ${cancelledOrder.orderNumber} (${cancelledOrder.id})`,
  );

  console.log("\nOrders seed complete");
  console.log(`Test customer: ${customer.email} (id: ${customer.id})`);
}

// ════════════════════════════════════════════════════════════
// ORDER DRAFTS SEED — runs after services (needs a real
// serviceId + serviceItemId to reference) and after the test
// customer exists
// ════════════════════════════════════════════════════════════
async function seedOrderDrafts() {
  const customer = await prisma.user.findUnique({
    where: { email: "customer.test@yeslaundrygh.com" },
  });

  if (!customer) {
    throw new Error(
      "No test customer found — orders seed must run before drafts.",
    );
  }

  const service = await prisma.service.findFirst({
    where: { title: "Stain Removal" },
    include: { items: { include: { item: true }, take: 2 } },
  });

  if (!service) {
    throw new Error(
      "No 'Stain Removal' service found — services seed must run first.",
    );
  }

  // ══════════════════════════════════════════════════════════
  // 1. Early-stage draft — service picked, nothing else yet.
  //    items is null: user hasn't reached the item-selection
  //    step of the booking wizard.
  // ══════════════════════════════════════════════════════════
  const earlyDraft = await prisma.orderDraft.create({
    data: {
      customerId: customer.id,
      serviceId: service.id,
      bagCount: null,
      weightKg: null,
      items: undefined, // Json column left null
      pickupAddress: "14 Spintex Road, Accra",
      pickupWindow: null,
      deliveryAddress: null,
      deliveryWindow: null,
      currentStep: "1",
    },
  });
  console.log(`Seeded early-stage draft: ${earlyDraft.id}`);

  // ══════════════════════════════════════════════════════════
  // 2. Later-stage draft — items selected, address filled,
  //    still missing a delivery window (not yet at checkout).
  //    items stored as plain { serviceItemId, quantity, notes }
  //    entries — no name/price baked in, resolved live on read.
  // ══════════════════════════════════════════════════════════
  const draftItems = service.items.map((si) => ({
    serviceItemId: si.id,
    quantity: 2,
    notes: null,
  }));

  const laterDraft = await prisma.orderDraft.create({
    data: {
      customerId: customer.id,
      serviceId: service.id,
      bagCount: null,
      weightKg: null,
      items: draftItems,
      pickupAddress: "East Legon, Accra",
      pickupWindow: new Date(Date.now() + 24 * 60 * 60 * 1000),
      deliveryAddress: "East Legon, Accra",
      deliveryWindow: null,
      currentStep: "3",
    },
  });
  console.log(`Seeded later-stage draft: ${laterDraft.id}`);

  console.log("Order drafts seed complete ✅");
}

// ════════════════════════════════════════════════════════════
// ENTRY POINT — services must complete before orders run
// ════════════════════════════════════════════════════════════
async function main() {
  await seedServices();
  await seedOrders();
  await seedOrderDrafts();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
