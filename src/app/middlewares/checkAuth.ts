import { NextFunction, Request, Response } from "express";
import { jwtHelper } from "../../helpers/jwtHelper";
import config from "../../config";
import httpStutas from "http-status";
import ApiError from "../errors/ApiError";

const checkAuth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        throw new ApiError(httpStutas.UNAUTHORIZED, "You are not authorized");
      }

      const verifyUser = jwtHelper.verifyToken(token, config.jwt.jwt_secret!);
      req.user = verifyUser;

      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new ApiError(httpStutas.UNAUTHORIZED, "You are not authorized");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkAuth;
