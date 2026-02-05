// src/modules/todo/todo.controller.ts
import type { Context } from "elysia";
import { TodoService } from "./todo.service";
import type { CreateTodoData, UpdateTodoData } from "./todo.schema";
import { HttpError } from "../../core/errors";

export const TodoController = {
  async create(ctx: Context<{ body: CreateTodoData }>) {
    const body = ctx.body;
    const todo = await TodoService.create(body);
    return { success: true, data: todo };
  },

  async list({
    query,
  }: {
    query: {
      page?: string;
      limit?: string;
      search?: string;
    }
  }) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;
    const search = query.search;

    const result = await TodoService.findAll({
      page,
      limit,
      search
    });

    return { success: true, result };
  },

  async get(ctx: Context<{ params: { id: string } }>) {
    const id = Number(ctx.params.id);
    const todo = await TodoService.findOne(id);
    if (!todo) {
      throw new HttpError(404, "Data Not Found");
    }
    return { success: true, data: todo };
  },

  async update(ctx: Context<{ params: { id: string }; body: UpdateTodoData }>) {
    const id = Number(ctx.params.id);
    const updated = await TodoService.update(id, ctx.body);
    if (!updated) {
      throw new HttpError(404, "Data Not Found");
    }
    return { success: true, data: updated };
  },

  async remove(ctx: Context<{ params: { id: string } }>) {
    const id = Number(ctx.params.id);
    const ok = await TodoService.remove(id);
    if (!ok) {
      throw new HttpError(404, "Data Not Found");
    }
    return { success: true };
  },
};
