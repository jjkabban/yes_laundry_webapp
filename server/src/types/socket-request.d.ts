import { Session, SessionData } from "express-session";
import { IncomingMessage } from "http";

declare module "http" {
  interface IncomingMessage {
    session: Session & Partial<SessionData>;
  }
}
