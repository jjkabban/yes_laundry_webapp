/*
  Warnings:

  - The `longitude` column on the `Location` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `latitude` column on the `Location` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "longitude",
ADD COLUMN     "longitude" DOUBLE PRECISION,
DROP COLUMN "latitude",
ADD COLUMN     "latitude" DOUBLE PRECISION;
