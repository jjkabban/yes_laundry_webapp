import { Router } from "express";
import {
  getLocation,
  getMe,
  googleCallback,
  googleRedirect,
  register,
  resendOtp,
  setManualLocation,
  signin,
  validateSession,
  verify,
} from "../controllers/auth";
import { validate } from "../middleware/auth.validate";
import { loginSchema, registerSchema } from "../validators/auth";
import { CheckUser } from "../middleware/auth";

const authRouter = Router();

authRouter.post("/signin", validate(loginSchema), signin);
authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/verify", verify);
authRouter.get("/google", googleRedirect);
authRouter.get("/google/callback", googleCallback);
authRouter.post("/resend-otp", resendOtp);
authRouter.get("/validate-session", validateSession);
authRouter.get("/location", CheckUser, getLocation);
authRouter.post("/location", CheckUser, setManualLocation);
authRouter.get("/me", CheckUser, getMe);

export default authRouter;
