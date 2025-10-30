-- CreateTable
CREATE TABLE "symptoms" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "symptoms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_symptoms" (
    "symptomsId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "doctor_symptoms_pkey" PRIMARY KEY ("symptomsId","doctorId")
);

-- AddForeignKey
ALTER TABLE "doctor_symptoms" ADD CONSTRAINT "doctor_symptoms_symptomsId_fkey" FOREIGN KEY ("symptomsId") REFERENCES "symptoms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_symptoms" ADD CONSTRAINT "doctor_symptoms_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
