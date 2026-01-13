/*
  Warnings:

  - Made the column `appointmentFee` on table `doctors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `followUpFee` on table `doctors` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "doctors" ALTER COLUMN "appointmentFee" SET NOT NULL,
ALTER COLUMN "followUpFee" SET NOT NULL;
