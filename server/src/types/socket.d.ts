import "socket.io";

declare module "socket.io" {
  interface Socket {
    user?: {
      id: string;
      role: "CUSTOMER" | "STAFF" | "ADMIN";
    };
  }
}
