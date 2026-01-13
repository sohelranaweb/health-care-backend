/*
  Warnings:

  - The primary key for the `doctor_experiences` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `doctorId` on table `doctor_experiences` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "doctor_experiences" DROP CONSTRAINT "doctor_experiences_doctorId_fkey";

-- AlterTable
ALTER TABLE "doctor_experiences" DROP CONSTRAINT "doctor_experiences_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "doctorId" SET NOT NULL,
ADD CONSTRAINT "doctor_experiences_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "doctor_experiences_id_seq";

-- AddForeignKey
ALTER TABLE "doctor_experiences" ADD CONSTRAINT "doctor_experiences_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
