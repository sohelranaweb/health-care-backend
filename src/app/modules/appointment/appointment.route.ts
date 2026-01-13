import { UserRole } from "@prisma/client";
import express from "express";
// import { paymentLimiter } from "../../middlewares/rateLimiter";
import validateRequest from "../../middlewares/validateRequest";
import { AppointmentController } from "./appointment.controller";
import { AppointmentValidation } from "./appointment.validation";
import checkAuth from "../../middlewares/checkAuth";
import { paymentLimiter } from "../../middlewares/rateLimiter";

const router = express.Router();

/**
 * ENDPOINT: /appointment/
 *
 * Get all appointment with filtering
 * Only accessable for Admin & Super Admin
 */
router.get(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AppointmentController.getAllFromDB
);

router.get(
  "/my-appointment",
  checkAuth(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentController.getMyAppointment
);

router.post(
  "/",
  checkAuth(UserRole.PATIENT),
  paymentLimiter,
  validateRequest(AppointmentValidation.createAppointment),
  AppointmentController.createAppointment
);

router.post(
  "/pay-later",
  checkAuth(UserRole.PATIENT),
  validateRequest(AppointmentValidation.createAppointment),
  AppointmentController.createAppointmentWithPayLater
);

router.post(
  "/:id/initiate-payment",
  checkAuth(UserRole.PATIENT),
  paymentLimiter,
  AppointmentController.initiatePayment
);

router.patch(
  "/status/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  AppointmentController.changeAppointmentStatus
);

router.post(
  "/pay-later",
  checkAuth(UserRole.PATIENT),
  AppointmentController.createAppointmentWithPayLater
);

export const AppointmentRoutes = router;
