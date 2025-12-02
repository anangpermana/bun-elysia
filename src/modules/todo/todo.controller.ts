// src/modules/todo/todo.controller.ts
import type { Context } from "elysia";
import { TodoService } from "./todo.service";
import type { CreateTodoData, UpdateTodoData } from "./todo.schema";

export const TodoController = {
  async create(ctx: Context<{ body: CreateTodoData }>) {
    const body = ctx.body;
    const todo = await TodoService.create(body);
    return { success: true, data: todo };
  },

  async list(ctx: Context) {
    const data = await TodoService.findAll();
    return { success: true, data };
  },

  async get(ctx: Context<{ params: { id: string } }>) {
    const id = Number(ctx.params.id);
    const todo = await TodoService.findOne(id);
    if (!todo) return new Response("Not found", { status: 404 });
    return { success: true, data: todo };
  },

  async update(ctx: Context<{ params: { id: string }; body: UpdateTodoData }>) {
    const id = Number(ctx.params.id);
    const updated = await TodoService.update(id, ctx.body);
    if (!updated) return new Response("Not found", { status: 404 });
    return { success: true, data: updated };
  },

  async remove(ctx: Context<{ params: { id: string } }>) {
    const id = Number(ctx.params.id);
    const ok = await TodoService.remove(id);
    if (!ok) return new Response("Not found", { status: 404 });
    return { success: true };
  },
};
