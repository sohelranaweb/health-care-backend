/*
  Warnings:

  - You are about to drop the column `InstitutionName` on the `doctors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "InstitutionName",
ADD COLUMN     "institutionName" TEXT;
