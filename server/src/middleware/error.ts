import { NextFunction, Response, Request } from "express";
import { ApiResponse } from "../controllers/types/auth.response";

export const globalError = (
  err: Error,
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction,
) => {
  console.log("an unknown error occured ", err);
  return res.status(500).json({
    message: "Something went wrong",
    success: false,
    data: null,
    error: [
      { field: "system", message: "Something went wron. Try again later" },
    ],
  });
};
