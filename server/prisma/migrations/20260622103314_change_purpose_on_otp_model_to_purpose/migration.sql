/*
  Warnings:

  - The `purpose` column on the `Otp` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "purpose",
ADD COLUMN     "purpose" "Purpose";
