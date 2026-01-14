import express from "express";
import { MetaController } from "./meta.controller";
import { UserRole } from "@prisma/client";
import checkAuth from "../../middlewares/checkAuth";

const router = express.Router();

router.get(
  "/",
  checkAuth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  MetaController.fetchDashboardMetaData
);

export const MetaRoutes = router;
