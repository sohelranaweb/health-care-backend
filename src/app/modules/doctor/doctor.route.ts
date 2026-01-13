import express from "express";
import { DoctorController } from "./doctor.controller";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorValidation } from "./doctor.validation";
import checkAuth from "../../middlewares/checkAuth";

const router = express.Router();

// AI driven doctor suggestion
router.post("/suggestion", DoctorController.getAiSuggestion);

// task 3
router.get("/", DoctorController.getAllFromDB);

//task 4
router.get("/:id", DoctorController.getByIdFromDB);

router.patch(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  validateRequest(DoctorValidation.update),
  DoctorController.updateIntoDB
);

//task 5
router.delete(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorController.deleteFromDB
);

// task 6
router.delete(
  "/soft/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorController.softDelete
);

export const DoctorRoutes = router;
