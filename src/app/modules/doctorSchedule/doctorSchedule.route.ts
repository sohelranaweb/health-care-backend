import { UserRole } from "@prisma/client";
import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";
import checkAuth from "../../middlewares/checkAuth";

const router = express.Router();

/**
 * API ENDPOINT: /doctor-schedule/
 *
 * Get all doctor schedule with filtering
 */
router.get(
  "/",
  checkAuth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  DoctorScheduleController.getAllFromDB
);

router.get(
  "/my-schedule",
  checkAuth(UserRole.DOCTOR),
  DoctorScheduleController.getMySchedule
);

router.post(
  "/",
  checkAuth(UserRole.DOCTOR),
  validateRequest(DoctorScheduleValidation.create),
  DoctorScheduleController.insertIntoDB
);

router.delete(
  "/:id",
  checkAuth(UserRole.DOCTOR),
  DoctorScheduleController.deleteFromDB
);

export const DoctorScheduleRoutes = router;
