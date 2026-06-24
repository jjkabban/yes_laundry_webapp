-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profileImageId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profileImageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
