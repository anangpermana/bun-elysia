// src/modules/todo/todo.schema.ts
import { t } from "elysia";
import type { Static } from "@sinclair/typebox";

export const CreateTodoDTO = t.Object({
  title: t.String({ minLength: 1 }),
  description: t.Optional(t.String()),
  completed: t.Optional(t.Boolean())
});

export const UpdateTodoDTO = t.Partial(CreateTodoDTO);

export type CreateTodoData = Static<typeof CreateTodoDTO>;
export type UpdateTodoData = Static<typeof UpdateTodoDTO>;
