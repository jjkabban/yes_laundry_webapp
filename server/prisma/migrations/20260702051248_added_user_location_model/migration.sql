-- CreateEnum
CREATE TYPE "LocationSource" AS ENUM ('GPS', 'IP', 'MANUAL');

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT,
    "neighborhood" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "source" "LocationSource" NOT NULL DEFAULT 'MANUAL',
    "longitude" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Location_userId_idx" ON "Location"("userId");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
