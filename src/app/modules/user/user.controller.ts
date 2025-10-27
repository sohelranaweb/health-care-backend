import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import { userFilterableFields } from "./user.constant";
import pick from "../../helpers/pick";
import httpStatus from "http-status";
import { IJwtPayload } from "../../types/common";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createPatient(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  // console.log({ req });
  const result = await UserService.createDoctor(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  // console.log({ req });
  const result = await UserService.createAdmin(req);
  // console.log("controller", result);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields); // searching, filtering
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]); // pagination and sorting

  const result = await UserService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user;

    const result = await UserService.getMyProfile(user as IJwtPayload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My profile data fetched!",
      data: result,
    });
  }
);

export const UserController = {
  createPatient,
  createAdmin,
  createDoctor,
  getAllFromDB,
  getMyProfile,
};
