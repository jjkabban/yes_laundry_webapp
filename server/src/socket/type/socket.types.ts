export const SocketEvents = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
} as const;

export const Rooms = {
  admin: (id: string) => `admin:${id}`,
  staff: (id: string) => `staff:${id}`,
  user: (id: string) => `user:${id}`,
  order: (id: string) => `order:${id}`,
  staff_all: () => "staff:all",
} as const;
