import { NextFunction, Response, Request } from "express";

export const CheckUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user?.id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  next();
};
