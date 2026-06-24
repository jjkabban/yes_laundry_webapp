import { Server } from "socket.io";
import { CheckAuth } from "./middleware/auth";
import { SocketEvents } from "./type/socket.types";
import registerEvents from "./lib/registerEvents";
import joinDefaultUserRooms from "./lib/initRooms";

export default function initSocket(io: Server) {
  io.use(CheckAuth);
  io.on(SocketEvents.CONNECTION, (socket) => {
    console.log("user connected ", socket.id);
    joinDefaultUserRooms(socket, socket.data.user);
    registerEvents(socket, io);
  });
}
