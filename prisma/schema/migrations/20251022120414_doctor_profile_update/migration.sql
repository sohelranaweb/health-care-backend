/*
  Warnings:

  - Added the required column `followUpFee` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "about" TEXT,
ADD COLUMN     "avgConsultationTime" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "followUpFee" TEXT NOT NULL,
ADD COLUMN     "patientAttended" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "qualificaion" DROP NOT NULL,
ALTER COLUMN "currentWorkingPlace" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ExperienceDetails" (
    "id" TEXT NOT NULL,
    "InstitutionName" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "ExperienceDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExperienceDetails" ADD CONSTRAINT "ExperienceDetails_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
