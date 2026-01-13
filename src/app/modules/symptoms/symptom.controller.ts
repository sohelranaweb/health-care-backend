import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SymptomsService } from "./symptom.service";
import pick from "../../../helpers/pick";
import httpStatus from "http-status";

const createSymptoms = catchAsync(async (req: Request, res: Response) => {
  const result = await SymptomsService.createSymptoms(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Symptoms created successful",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit"]); // pagination and sorting

  const result = await SymptomsService.getAllFromDB(options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Symptoms data fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});
const updateSymptomById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SymptomsService.updateSymptomById(id, req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Symptom updated successfully",
    data: result,
  });
});

const deleteSymptom = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SymptomsService.deleteSymptom(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Symptom deleted successfully",
    data: result,
  });
});

export const SymptomsController = {
  createSymptoms,
  getAllFromDB,
  updateSymptomById,
  deleteSymptom,
};
