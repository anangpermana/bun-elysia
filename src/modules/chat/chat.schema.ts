import { t } from "elysia";

export const sendMessageSchema = t.Object({
  receiverId: t.Number(),
  message: t.String(),
});

export const chatParamsSchema = t.Object({
  userId: t.Number(),
});
