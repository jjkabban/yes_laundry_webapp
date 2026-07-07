/*
  Warnings:

  - Added the required column `type` to the `Policy` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `title` on the `Policy` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Policy" ADD COLUMN     "type" "PolicyTitle" NOT NULL,
DROP COLUMN "title",
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Policy_title_key" ON "Policy"("title");
