import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SpecialtiesService } from "./specialties.service";
import httpStatus from "http-status";
import { specialtiesFilterableFields } from "./specialties.constant";
import pick from "../../helpers/pick";

const createSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.createSpecialties(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Specialty created successful",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, specialtiesFilterableFields); // searching, filtering
  const options = pick(req.query, ["page", "limit"]); // pagination and sorting

  // console.log("filter", req.query);
  const result = await SpecialtiesService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties data fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateSpecialtyById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SpecialtiesService.updateSpecialtyById(id, req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialty updated successfully",
    data: result,
  });
});

const deleteSpecialty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SpecialtiesService.deleteSpecialty(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialty deleted successfully",
    data: result,
  });
});
export const SpecialtiesController = {
  createSpecialties,
  getAllFromDB,
  updateSpecialtyById,
  deleteSpecialty,
};
