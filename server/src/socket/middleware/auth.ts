import { Socket } from "socket.io";
import { parse } from "cookie";
import { prisma } from "../../lib/prisma";

export const CheckAuth = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  const cookieHeader = socket.handshake.headers.cookie;

  if (!cookieHeader) return next(new Error("Unauthorized"));
  console.log("1. cookie header:", cookieHeader);

  const cookies = parse(cookieHeader);
  const sessionId = cookies["session_id"];

  if (!sessionId) return next(new Error("Unauthorized"));

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
  console.log("3. session found:", session?.id, "expires:", session?.expiresAt);

  if (!session || session.expiresAt < new Date())
    return next(new Error("Unauthorized"));

  socket.data.user = session.user;
  return next();
};
