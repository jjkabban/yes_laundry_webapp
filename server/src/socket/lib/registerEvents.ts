import { Server, Socket } from "socket.io";
import chatEvents from "../events/chat.events";
import orderEvents from "../events/order.events";

export default function registerEvents(socket: Socket, io: Server) {
  chatEvents(socket, io);
  orderEvents(socket, io);
}
