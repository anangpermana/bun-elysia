// src/modules/todo/todo.service.ts
import { db } from "../../config/db";
import { todos } from "../../drizzle/schema";
import { eq, desc, ilike, or, sql } from "drizzle-orm";
import type { CreateTodoData, UpdateTodoData } from "./todo.schema";

export class TodoService {
  static async create(payload: CreateTodoData) {
    const [row] = await db.insert(todos).values({
      title: payload.title,
      description: payload.description ?? "",
    }).returning();
    return row;
  }

  static async findAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const page = Math.max(1, params?.page ?? 1);
    const limit = Math.min(100, params?.limit ?? 10);
    const offset = (page - 1) * limit;
    const search = params?.search?.trim();

    //where condition
    const where = search
    ? or(
      ilike(todos.title, '%${search}%'),
      ilike(todos.description, '%${search}%')
    ) : undefined;
    
    //data
    const data = await db
    .select()
    .from(todos)
    .where(where)
    .orderBy(desc(todos.created_at))
    .limit(limit)
    .offset(offset)

    //total count
    const countResult = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(todos)
    .where(where)

    const total = Number(countResult[0]?.count ?? 0)
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        search: search ?? null,
      }
    }
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
