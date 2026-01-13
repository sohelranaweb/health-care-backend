import express from "express";
import { PrescriptionController } from "./prescription.controller";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { PrescriptionValidation } from "./prescription.validation";
import checkAuth from "../../middlewares/checkAuth";

const router = express.Router();

router.get(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PrescriptionController.getAllFromDB
);

router.get(
  "/my-prescription",
  checkAuth(UserRole.PATIENT),
  PrescriptionController.patientPrescription
);

router.post(
  "/",
  checkAuth(UserRole.DOCTOR),
  validateRequest(PrescriptionValidation.create),
  PrescriptionController.insertIntoDB
);

export const PrescriptionRoutes = router;
