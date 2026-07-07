import "dotenv/config";
import express, { NextFunction, Response, Request } from "express";
import { Server, Socket } from "socket.io";
import cors from "cors";
import session from "express-session";
import { authRouter, serviceRouter, orderRouter } from "./routes";
import { createServer } from "node:http";
import { sessionMiddleware } from "./middleware/session";
import initSocket from "./socket";
import cookieParser from "cookie-parser";
import { globalError } from "./middleware/error";
import { ApiResponse } from "./controllers/types/auth.response";

const app = express();
app.set("trust proxy", 1);
const httpServer = createServer(app);
const allowedOrigins = [
  "http://localhost:3000",
  "http://10.158.13.177:3000",
  "http://10.249.76.177:3000",
  "http://10.249.76.177:3000",
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
app.use("/api/service", serviceRouter);
app.use("/api/order", orderRouter);

initSocket(io);

app.use((req: Request, res: Response<ApiResponse<null>>) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    data: null,
    error: [
      {
        field: "system",
        message: `No route found for ${req.method} ${req.originalUrl}`,
      },
    ],
  });
});

app.use(globalError);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
