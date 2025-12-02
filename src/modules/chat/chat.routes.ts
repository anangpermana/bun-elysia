import { Elysia } from "elysia";
import { ChatController } from "./chat.controller";
import { sendMessageSchema, chatParamsSchema } from "./chat.schema";
import { AuthGuard } from "../../core/guard";

export const chatRoutes = new Elysia({ prefix: "chat" })
  .derive(AuthGuard.derive)
  .post("/send", ChatController.send, { body: sendMessageSchema })
  .get("/conversation/:userId", ChatController.conversation, {
    params: chatParamsSchema,
  });
