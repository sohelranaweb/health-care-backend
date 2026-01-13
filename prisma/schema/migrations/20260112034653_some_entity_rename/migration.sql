/*
  Warnings:

  - You are about to drop the column `department` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `designation` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `doctors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "department",
DROP COLUMN "designation",
DROP COLUMN "endDate",
DROP COLUMN "experience",
DROP COLUMN "startDate";

-- CreateTable
CREATE TABLE "doctor_experiences" (
    "id" SERIAL NOT NULL,
    "instituteName" TEXT,
    "Designation" TEXT,
    "Department" TEXT,
    "startDate" TEXT,
    "endDate" TEXT,
    "period" INTEGER NOT NULL,
    "doctorId" TEXT,

    CONSTRAINT "doctor_experiences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "doctor_experiences" ADD CONSTRAINT "doctor_experiences_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
