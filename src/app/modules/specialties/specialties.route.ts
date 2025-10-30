import { UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { SpecialtiesController } from "./specialties.controller";
import checkAuth from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { SpecialtiesValidtaion } from "./specialties.validation";
import { fileUploader } from "../../helpers/fileUploader";

const router = express.Router();

router.get("/", SpecialtiesController.getAllFromDB);

router.post(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidtaion.create.parse(JSON.parse(req.body.data));
    return SpecialtiesController.createSpecialties(req, res, next);
  }
);

router.patch(
  "/update-specialty/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return SpecialtiesController.updateSpecialtyById(req, res, next);
  }
);

router.delete(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SpecialtiesController.deleteSpecialty
);

export const SpecialtiesRoutes = router;
