-- CreateTable
CREATE TABLE "RecurringOrderItem" (
    "id" TEXT NOT NULL,
    "recurringOrderId" TEXT NOT NULL,
    "serviceItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceAtOrder" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecurringOrderItem_recurringOrderId_serviceItemId_key" ON "RecurringOrderItem"("recurringOrderId", "serviceItemId");

-- AddForeignKey
ALTER TABLE "RecurringOrderItem" ADD CONSTRAINT "RecurringOrderItem_recurringOrderId_fkey" FOREIGN KEY ("recurringOrderId") REFERENCES "RecurringOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringOrderItem" ADD CONSTRAINT "RecurringOrderItem_serviceItemId_fkey" FOREIGN KEY ("serviceItemId") REFERENCES "ServiceItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
