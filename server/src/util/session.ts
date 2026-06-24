import { SESSION_DURATION } from "../constants/session";
import { Role } from "../controllers/types/auth";

export function getSessionDuration(
  role: Role,
  rememberMe: boolean = false,
): number {
  // staff and admin get shorter sessions
  if (role === "STAFF" || role === "ADMIN") return SESSION_DURATION.SHORT;
  // customers  longer sessions
  if (rememberMe) return SESSION_DURATION.REMEMBER_ME;
  return SESSION_DURATION.DEFAULT;
}
