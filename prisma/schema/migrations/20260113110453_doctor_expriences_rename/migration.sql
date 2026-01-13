/*
  Warnings:

  - You are about to drop the column `Department` on the `doctor_experiences` table. All the data in the column will be lost.
  - You are about to drop the column `Designation` on the `doctor_experiences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor_experiences" DROP COLUMN "Department",
DROP COLUMN "Designation",
ADD COLUMN     "department" TEXT,
ADD COLUMN     "designation" TEXT;
