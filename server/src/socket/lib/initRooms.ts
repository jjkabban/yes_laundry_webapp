import { Socket } from "socket.io";
import { Rooms } from "../type/socket.types";
import { User } from "../../controllers/types/auth";
export default function joinDefaultUserRooms(socket: Socket, user: User) {
  switch (user.role) {
    case "ADMIN":
      socket.join(Rooms.admin(user.id));
      socket.join(Rooms.staff_all());
      break;
    case "CUSTOMER":
      socket.join(Rooms.user(user.id));
      socket.join(Rooms.order(user.id));
      break;
    case "STAFF":
      socket.join(Rooms.staff(user.id));
      socket.join(Rooms.staff_all());
  }
}
