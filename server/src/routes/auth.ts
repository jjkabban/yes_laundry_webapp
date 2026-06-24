import { Router } from "express";
import {
  getMe,
  googleCallback,
  googleRedirect,
  register,
  resendOtp,
  signin,
  validateSession,
  verify,
} from "../controllers/auth";
import { validate } from "../middleware/auth.validate";
import { loginSchema, registerSchema } from "../validators/auth";

const authRouter = Router();

authRouter.post("/signin", validate(loginSchema), signin);
authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/verify", verify);
authRouter.get("/google", googleRedirect);
authRouter.get("/google/callback", googleCallback);
authRouter.post("/resend-otp", resendOtp);
authRouter.get("/validate-session", validateSession);
authRouter.get("/me", getMe);

export default authRouter;
