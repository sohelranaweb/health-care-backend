import { UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { fileUploader } from "../../../helpers/fileUploader";
import { SymptomsValidtaion } from "./symptom.validation";
import { SymptomsController } from "./symptom.controller";

const router = express.Router();

router.get("/", SymptomsController.getAllFromDB);

router.post(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SymptomsValidtaion.create.parse(JSON.parse(req.body.data));
    return SymptomsController.createSymptoms(req, res, next);
  }
);

router.patch(
  "/update-symptom/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return SymptomsController.updateSymptomById(req, res, next);
  }
);

router.delete(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SymptomsController.deleteSymptom
);

export const SymptomsRoutes = router;
