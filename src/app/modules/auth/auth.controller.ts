import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import config from "../../../config";
import { IAuthUser } from "../../interfaces/common";
import ApiError from "../../errors/ApiError";

const login = catchAsync(async (req: Request, res: Response) => {
  const accessTokenExpiresIn = config.jwt.expires_in as string;
  const refreshTokenExpiresIn = config.jwt.refresh_token_expires_in as string;
  // convert accessTokenExpiresIn to milliseconds
  let accessTokenMaxAge = 0;
  const accessTokenUnit = accessTokenExpiresIn.slice(-1);
  const accessTokenValue = parseInt(accessTokenExpiresIn.slice(0, -1));
  if (accessTokenUnit === "y") {
    accessTokenMaxAge = accessTokenValue * 365 * 24 * 60 * 60 * 1000;
  } else if (accessTokenUnit === "M") {
    accessTokenMaxAge = accessTokenValue * 30 * 24 * 60 * 60 * 1000;
  } else if (accessTokenUnit === "w") {
    accessTokenMaxAge = accessTokenValue * 7 * 24 * 60 * 60 * 1000;
  } else if (accessTokenUnit === "d") {
    accessTokenMaxAge = accessTokenValue * 24 * 60 * 60 * 1000;
  } else if (accessTokenUnit === "h") {
    accessTokenMaxAge = accessTokenValue * 60 * 60 * 1000;
  } else if (accessTokenUnit === "m") {
    accessTokenMaxAge = accessTokenValue * 60 * 1000;
  } else if (accessTokenUnit === "s") {
    accessTokenMaxAge = accessTokenValue * 1000;
  } else {
    accessTokenMaxAge = 1000 * 60 * 60; // default 1 hour
  }

  // convert refreshTokenExpiresIn to milliseconds
  let refreshTokenMaxAge = 0;
  const refreshTokenUnit = refreshTokenExpiresIn.slice(-1);
  const refreshTokenValue = parseInt(refreshTokenExpiresIn.slice(0, -1));
  if (refreshTokenUnit === "y") {
    refreshTokenMaxAge = refreshTokenValue * 365 * 24 * 60 * 60 * 1000;
  } else if (refreshTokenUnit === "M") {
    refreshTokenMaxAge = refreshTokenValue * 30 * 24 * 60 * 60 * 1000;
  } else if (refreshTokenUnit === "w") {
    refreshTokenMaxAge = refreshTokenValue * 7 * 24 * 60 * 60 * 1000;
  } else if (refreshTokenUnit === "d") {
    refreshTokenMaxAge = refreshTokenValue * 24 * 60 * 60 * 1000;
  } else if (refreshTokenUnit === "h") {
    refreshTokenMaxAge = refreshTokenValue * 60 * 60 * 1000;
  } else if (refreshTokenUnit === "m") {
    refreshTokenMaxAge = refreshTokenValue * 60 * 1000;
  } else if (refreshTokenUnit === "s") {
    refreshTokenMaxAge = refreshTokenValue * 1000;
  } else {
    refreshTokenMaxAge = 1000 * 60 * 60 * 24 * 30; // default 30 days
  }
  const result = await AuthService.login(req.body);
  const { accessToken, refreshToken, needPasswordChange } = result;

  // console.log({ accessToken, refreshToken });
  res.cookie("accessToken", accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: accessTokenMaxAge,
  });
  res.cookie("refreshToken", refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: refreshTokenMaxAge,
  });
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User Loggedin successfully",
    data: {
      needPasswordChange,
    },
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userSession = req.cookies;
  const result = await AuthService.getMe(userSession);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully!",
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  /*
  EXPIRES_IN=7d 

REFRESH_TOKEN_EXPIRES_IN=1y 
  */
  const accessTokenExpiresIn = config.jwt.expires_in as string;
  const refreshTokenExpiresIn = config.jwt.refresh_token_expires_in as string;

  // convert accessTokenExpiresIn to milliseconds
  let accessTokenMaxAge = 0;
  const accessTokenUnit = accessTokenExpiresIn.slice(-1);
  const accessTokenValue = parseInt(accessTokenExpiresIn.slice(0, -1));
  if (accessTokenUnit === "y") {
    accessTokenMaxAge = accessTokenValue * 365 * 24 * 60 * 60 * 1000;
  } else if (accessTokenUnit === "M") {
    accessTokenMaxAge = accessTokenValue * 30 * 24 * 60 * 60 * 1000;
  } else if (accessTokenUnit === "w") {
    accessTokenMaxAge = accessTokenValue * 7 * 24 * 60 * 60 * 1000;
  } else if (accessTokenUnit === "d") {
    accessTokenMaxAge = accessTokenValue * 24 * 60 * 60 * 1000;
  } else if (accessTokenUnit === "h") {
    accessTokenMaxAge = accessTokenValue * 60 * 60 * 1000;
  } else if (accessTokenUnit === "m") {
    accessTokenMaxAge = accessTokenValue * 60 * 1000;
  } else if (accessTokenUnit === "s") {
    accessTokenMaxAge = accessTokenValue * 1000;
  } else {
    accessTokenMaxAge = 1000 * 60 * 60; // default 1 hour
  }

  // convert refreshTokenExpiresIn to milliseconds
  let refreshTokenMaxAge = 0;
  const refreshTokenUnit = refreshTokenExpiresIn.slice(-1);
  const refreshTokenValue = parseInt(refreshTokenExpiresIn.slice(0, -1));
  if (refreshTokenUnit === "y") {
    refreshTokenMaxAge = refreshTokenValue * 365 * 24 * 60 * 60 * 1000;
  } else if (refreshTokenUnit === "M") {
    refreshTokenMaxAge = refreshTokenValue * 30 * 24 * 60 * 60 * 1000;
  } else if (refreshTokenUnit === "w") {
    refreshTokenMaxAge = refreshTokenValue * 7 * 24 * 60 * 60 * 1000;
  } else if (refreshTokenUnit === "d") {
    refreshTokenMaxAge = refreshTokenValue * 24 * 60 * 60 * 1000;
  } else if (refreshTokenUnit === "h") {
    refreshTokenMaxAge = refreshTokenValue * 60 * 60 * 1000;
  } else if (refreshTokenUnit === "m") {
    refreshTokenMaxAge = refreshTokenValue * 60 * 1000;
  } else if (refreshTokenUnit === "s") {
    refreshTokenMaxAge = refreshTokenValue * 1000;
  } else {
    refreshTokenMaxAge = 1000 * 60 * 60 * 24 * 30; // default 30 days
  }

  const result = await AuthService.refreshToken(refreshToken);
  res.cookie("accessToken", result.accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: accessTokenMaxAge,
  });

  res.cookie("refreshToken", result.refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: refreshTokenMaxAge,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token genereated successfully!",
    data: {
      message: "Access token genereated successfully!",
    },
  });
});
const changePassword = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }
    const user = req.user;

    const result = await AuthService.changePassword(
      user as IAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Changed successfully",
      data: result,
    });
  }
);
const resetPassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    // Extract token from Authorization header (remove "Bearer " prefix)
    const authHeader = req.headers.authorization;
    console.log({ authHeader });
    const token = authHeader ? authHeader.replace("Bearer ", "") : null;
    const user = req.user; // Will be populated if authenticated via middleware

    await AuthService.resetPassword(token, req.body, user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Reset!",
      data: null,
    });
  }
);
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Check your email!",
    data: null,
  });
});
export const AuthController = {
  login,
  getMe,
  refreshToken,
  changePassword,
  resetPassword,
  forgotPassword,
};
