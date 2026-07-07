import { Response, Request, NextFunction, Router } from "express";
import { getServiceById, getServices } from "../controllers/service";

const serviceRouter = Router();

serviceRouter.get("/all", getServices);
serviceRouter.get("/:id", getServiceById);
serviceRouter.delete("/:id", () => {});

export default serviceRouter;
