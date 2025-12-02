// src/modules/todo/todo.service.ts
import { db } from "../../config/db";
import { todos } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import type { CreateTodoData, UpdateTodoData } from "./todo.schema";

export class TodoService {
  static async create(payload: CreateTodoData) {
    const [row] = await db.insert(todos).values({
      title: payload.title,
      description: payload.description ?? "",
    }).returning();
    return row;
  }

  static async findAll() {
    return db.select().from(todos).orderBy(desc(todos.created_at));
  }

  static async findOne(id: number) {
    const [row] = await db.select().from(todos).where(eq(todos.id, id));
    return row ?? null;
  }

  static async update(id: number, payload: UpdateTodoData) {
    const [row] = await db.update(todos).set(payload as any).where(eq(todos.id, id)).returning();
    return row ?? null;
  }

  static async remove(id: number) {
    const [row] = await db.delete(todos).where(eq(todos.id, id)).returning({ id: todos.id });
    return !!row;
  }
}
