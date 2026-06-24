import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { ApiResponse } from "../controllers/types/auth.response";

export const validate = (schema: ZodType<any, any, any>) => {
  return async (
    req: Request,
    res: Response<ApiResponse<null>>,
    next: NextFunction,
  ): Promise<any> => {
    try {
      const parsedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // 1. req.body can be assigned normally
      req.body = parsedData.body;

      // 2. FIXED: Use Object.assign to mutate the properties instead of overwriting the getter
      if (parsedData.query) {
        // Clear old raw fields and inject the clean, parsed Zod values
        Object.keys(req.query).forEach((key) => delete req.query[key]);
        Object.assign(req.query, parsedData.query);
      }

      if (parsedData.params) {
        Object.keys(req.params).forEach((key) => delete req.params[key]);
        Object.assign(req.params, parsedData.params);
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          field: issue.path.slice(1).join("."),
          message: issue.message,
        }));

        // Your clean error structure array will pass perfectly now
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          error: Array.isArray(errorMessages)
            ? errorMessages
            : [
                {
                  ...((errorMessages as { field: string; message: string }) ??
                    []),
                },
              ],
        } as any);
      }

      return next(error);
    }
  };
};
