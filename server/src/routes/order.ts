import { Router, Response, Request, NextFunction } from "express";
import {
  getUserDraftOrder,
  getUserDraftOrders,
  getUserOrder,
  getUserOrders,
} from "../controllers/order";
import { CheckUser } from "../middleware/auth";

const orderRouter = Router();

orderRouter.get("/user", CheckUser, getUserOrders);
orderRouter.get("/:id", CheckUser, getUserOrder);
orderRouter.get("/draft/user", CheckUser, getUserDraftOrders);
orderRouter.get("/draft/user/:id", CheckUser, getUserDraftOrder);

export default orderRouter;
