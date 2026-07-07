/*
  Warnings:

  - A unique constraint covering the columns `[coverImageId]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coverImageId` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Made the column `icon` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PolicyTitle" AS ENUM ('CANCELLATION', 'DAMAGED_AND_LOST_ITEMS', 'SPECIAL_CARE_ITEMS', 'REWASH_GUARANTEE');

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "coverImageId" TEXT NOT NULL,
ALTER COLUMN "icon" SET NOT NULL;

-- CreateTable
CREATE TABLE "CareAndHandling" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareAndHandling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HowItWorks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HowItWorks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inclusions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inclusions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "title" "PolicyTitle" NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CareAndHandlingToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CareAndHandlingToService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_InclusionsToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InclusionsToService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PolicyToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PolicyToService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Policy_title_key" ON "Policy"("title");

-- CreateIndex
CREATE INDEX "_CareAndHandlingToService_B_index" ON "_CareAndHandlingToService"("B");

-- CreateIndex
CREATE INDEX "_InclusionsToService_B_index" ON "_InclusionsToService"("B");

-- CreateIndex
CREATE INDEX "_PolicyToService_B_index" ON "_PolicyToService"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Service_coverImageId_key" ON "Service"("coverImageId");

-- AddForeignKey
ALTER TABLE "HowItWorks" ADD CONSTRAINT "HowItWorks_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HowItWorks" ADD CONSTRAINT "HowItWorks_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CareAndHandlingToService" ADD CONSTRAINT "_CareAndHandlingToService_A_fkey" FOREIGN KEY ("A") REFERENCES "CareAndHandling"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CareAndHandlingToService" ADD CONSTRAINT "_CareAndHandlingToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InclusionsToService" ADD CONSTRAINT "_InclusionsToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Inclusions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InclusionsToService" ADD CONSTRAINT "_InclusionsToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PolicyToService" ADD CONSTRAINT "_PolicyToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Policy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PolicyToService" ADD CONSTRAINT "_PolicyToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
