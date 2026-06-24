import session from "express-session";
import pgSession from "connect-pg-simple";
import pkg from "pg";

const { Pool } = pkg;
const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });

export const sessionMiddleware = session({
  store: new (pgSession(session))({
    pool: pgPool,
    tableName: "session",
  }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});
