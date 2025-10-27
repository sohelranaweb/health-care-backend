/*
  Warnings:

  - You are about to drop the column `designation` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `qualificaion` on the `doctors` table. All the data in the column will be lost.
  - Changed the type of `followUpFee` on the `doctors` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ExperienceDetails" ALTER COLUMN "InstitutionName" DROP NOT NULL,
ALTER COLUMN "designation" DROP NOT NULL,
ALTER COLUMN "department" DROP NOT NULL,
ALTER COLUMN "period" DROP NOT NULL,
ALTER COLUMN "startTime" DROP NOT NULL,
ALTER COLUMN "endTime" DROP NOT NULL;

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "designation",
DROP COLUMN "qualificaion",
ADD COLUMN     "qualification" TEXT,
DROP COLUMN "followUpFee",
ADD COLUMN     "followUpFee" INTEGER NOT NULL;
