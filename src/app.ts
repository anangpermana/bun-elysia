import { Elysia, status } from "elysia";
import { jwtPlugin } from "./core/jwt";
import { authRoutes } from "./modules/auth/auth.routes";
import { logger } from "elysia-logger";
import { chatRoutes } from "./modules/chat/chat.routes";
import { todoRoutes } from "./modules/todo/todo.routes";
import { engine, io } from "./socket";
import { registerChatSocket } from "./modules/chat/chat.socket";
import { cors } from '@elysiajs/cors'
import { HttpError } from "./core/errors";

registerChatSocket(io);

export const app = new Elysia()
  .onError(({ error, set }) => {
    if (error instanceof HttpError) {
      set.status = error.status;
      return {
        success: false,
        status: error.status,
        message: error.message
      }
    }
    set.status = 500;
    return {
      success: false,
      status: 500,
      message: 'Internal Server Error',
    };
  })
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