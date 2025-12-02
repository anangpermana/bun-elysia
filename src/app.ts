import { Elysia } from "elysia";
import { jwtPlugin } from "./core/jwt";
import { authRoutes } from "./modules/auth/auth.routes";
import { logger } from "elysia-logger";
import { chatRoutes } from "./modules/chat/chat.routes";
import { todoRoutes } from "./modules/todo/todo.routes";

export const app = new Elysia()
  .use(logger())
  .use(jwtPlugin)
  .use(chatRoutes)
  .group("/api", (app) =>
    app
    .use(authRoutes)
    .use(chatRoutes)
    .use(todoRoutes)
  )
  .get("/", () => "Elysia API Ready");