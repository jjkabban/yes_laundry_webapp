import { Socket } from "socket.io";
import { parse } from "cookie";
import cookieParser from "cookie-parser";
import { sessionStore } from "../../middleware/session";

export const CheckAuth = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  const cookieHeader = socket.handshake.headers.cookie;

  if (!cookieHeader) return next(new Error("Unauthorized"));

  const cookies = parse(cookieHeader);
  const rawCookie = cookies["connect.sid"];

  if (!rawCookie) return next(new Error("Unauthorized"));

  const sessionId = cookieParser.signedCookie(
    decodeURIComponent(rawCookie),
    process.env.SESSION_SECRET!,
  );

  if (!sessionId) return next(new Error("Unauthorized"));

  // ask the session store (connect-pg-simple) to load the session data
  sessionStore.get(sessionId, (err, session) => {
    if (err || !session || !session.user?.id) {
      return next(new Error("Unauthorized"));
    }

    socket.data.user = session.user;
    return next();
  });
};
