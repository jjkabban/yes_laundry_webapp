/*
  Warnings:

  - A unique constraint covering the columns `[availabilityId]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endTime` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeSlot` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availabilityId` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SlotName" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL,
ADD COLUMN     "timeSlot" "SlotName" NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "availabilityId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AddOn" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AddOn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceAddOn" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "addOnId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceAddOn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceAvailability" (
    "id" TEXT NOT NULL,
    "windowDays" INTEGER NOT NULL DEFAULT 90,
    "blockedDays" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "blockedDates" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceTimeSlotDefault" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "timeSlotId" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ServiceTimeSlotDefault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceTimeSlotOverride" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeSlotId" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ServiceTimeSlotOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSlot" (
    "id" TEXT NOT NULL,
    "name" "SlotName" NOT NULL,
    "label" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceAddOn_serviceId_addOnId_key" ON "ServiceAddOn"("serviceId", "addOnId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceTimeSlotDefault_serviceId_timeSlotId_key" ON "ServiceTimeSlotDefault"("serviceId", "timeSlotId");

-- CreateIndex
CREATE INDEX "ServiceTimeSlotOverride_serviceId_date_idx" ON "ServiceTimeSlotOverride"("serviceId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceTimeSlotOverride_serviceId_date_timeSlotId_key" ON "ServiceTimeSlotOverride"("serviceId", "date", "timeSlotId");

-- CreateIndex
CREATE UNIQUE INDEX "Service_availabilityId_key" ON "Service"("availabilityId");

-- AddForeignKey
ALTER TABLE "ServiceAddOn" ADD CONSTRAINT "ServiceAddOn_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAddOn" ADD CONSTRAINT "ServiceAddOn_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "AddOn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "ServiceAvailability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceTimeSlotDefault" ADD CONSTRAINT "ServiceTimeSlotDefault_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceTimeSlotDefault" ADD CONSTRAINT "ServiceTimeSlotDefault_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceTimeSlotOverride" ADD CONSTRAINT "ServiceTimeSlotOverride_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceTimeSlotOverride" ADD CONSTRAINT "ServiceTimeSlotOverride_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
