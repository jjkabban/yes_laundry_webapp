import "dotenv/config";
import express, { NextFunction, Response, Request } from "express";
import { Server, Socket } from "socket.io";
import cors from "cors";
import session from "express-session";
import { authRouter } from "./routes";
import { createServer } from "node:http";
import { sessionMiddleware } from "./middleware/session";
import initSocket from "./socket";
import cookieParser from "cookie-parser";

const app = express();
const httpServer = createServer(app);
const allowedOrigins = [
  "http://10.51.180.177:3000",
  "http://192.168.110.178:3000",
  "http://localhost:3000",
  "http://192.168.110.179:3000",
  "http://192.168.1.121:3000",
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["POST", "PUT", "GET", "PATCH", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
  ],
  credentials: true,
};

const io = new Server(httpServer, {
  cors: corsOptions,
});

//startup middlewares
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(sessionMiddleware);
io.use((socket: Socket, next: (err?: Error) => void) => {
  sessionMiddleware(socket.request as any, {} as any, next as any);
});

app.use("/api/auth", authRouter);

initSocket(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
