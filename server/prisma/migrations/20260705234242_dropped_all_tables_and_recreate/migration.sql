/*
  Warnings:

  - Added the required column `provider` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('MTN', 'TELECEL', 'AIRTELTIGO');

-- AlterTable
ALTER TABLE "ServiceAddOn" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "provider" "PaymentProvider" NOT NULL;

-- CreateTable
CREATE TABLE "OrderAddOn" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "serviceAddOnId" TEXT NOT NULL,
    "priceAtOrder" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderAddOn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDraftAddOn" (
    "id" TEXT NOT NULL,
    "orderDraftId" TEXT NOT NULL,
    "priceAtOrder" DECIMAL(10,2) NOT NULL,
    "serviceAddOnId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderDraftAddOn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringOrderAddOn" (
    "id" TEXT NOT NULL,
    "recurringOrderId" TEXT NOT NULL,
    "serviceAddOnId" TEXT NOT NULL,
    "priceAtOrder" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecurringOrderAddOn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderDraftAddOn_orderDraftId_serviceAddOnId_key" ON "OrderDraftAddOn"("orderDraftId", "serviceAddOnId");

-- CreateIndex
CREATE UNIQUE INDEX "RecurringOrderAddOn_recurringOrderId_serviceAddOnId_key" ON "RecurringOrderAddOn"("recurringOrderId", "serviceAddOnId");

-- AddForeignKey
ALTER TABLE "OrderAddOn" ADD CONSTRAINT "OrderAddOn_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderAddOn" ADD CONSTRAINT "OrderAddOn_serviceAddOnId_fkey" FOREIGN KEY ("serviceAddOnId") REFERENCES "ServiceAddOn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDraftAddOn" ADD CONSTRAINT "OrderDraftAddOn_orderDraftId_fkey" FOREIGN KEY ("orderDraftId") REFERENCES "OrderDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDraftAddOn" ADD CONSTRAINT "OrderDraftAddOn_serviceAddOnId_fkey" FOREIGN KEY ("serviceAddOnId") REFERENCES "ServiceAddOn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringOrderAddOn" ADD CONSTRAINT "RecurringOrderAddOn_recurringOrderId_fkey" FOREIGN KEY ("recurringOrderId") REFERENCES "RecurringOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringOrderAddOn" ADD CONSTRAINT "RecurringOrderAddOn_serviceAddOnId_fkey" FOREIGN KEY ("serviceAddOnId") REFERENCES "ServiceAddOn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
