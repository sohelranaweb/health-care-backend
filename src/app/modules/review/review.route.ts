import express from "express";
import { ReviewController } from "./review.controller";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewValidation } from "./review.validation";
import checkAuth from "../../middlewares/checkAuth";

const router = express.Router();

router.get("/", ReviewController.getAllFromDB);

router.post(
  "/",
  checkAuth(UserRole.PATIENT),
  validateRequest(ReviewValidation.create),
  ReviewController.insertIntoDB
);

export const ReviewRoutes = router;
