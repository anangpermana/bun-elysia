import { Elysia } from "elysia";
import { jwtPlugin } from "./core/jwt";
import { authRoutes } from "./modules/auth/auth.routes";
import { logger } from "elysia-logger";
import { chatRoutes } from "./modules/chat/chat.routes";
import { todoRoutes } from "./modules/todo/todo.routes";
import { engine, io } from "./socket";
import { registerChatSocket } from "./modules/chat/chat.socket";
import { cors } from '@elysiajs/cors'

registerChatSocket(io);

export const app = new Elysia()
  .use(
    cors({
      origin: '*'
    })
  )
  .use(logger())
  .use(jwtPlugin)
  .use(chatRoutes)
  .group("/api", (app) =>
    app
    .use(authRoutes)
    .use(chatRoutes)
    .use(todoRoutes)
  )
  .all('/socket.io/*', ({ request, server}) => {
    if (!server) {
      return new Response('Socket.IO not ready', { status: 503});
    }
    return engine.handleRequest(request, server)
  })
  .get("/", () => "Elysia API Ready");