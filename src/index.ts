import { Elysia } from "elysia";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { usersRoute } from "./routes/users-route";

const connection = await mysql.createConnection(
  process.env.DATABASE_URL || "mysql://root:@localhost:3306/vibe_db"
);

export const db = drizzle(connection);

const app = new Elysia()
  .get("/", () => "Hello World")
  .get("/health", () => ({ status: "ok" }))
  .use(usersRoute)
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
