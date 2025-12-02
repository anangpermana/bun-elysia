import { Elysia } from "elysia";
import { TodoController } from "./todo.controller";
import { CreateTodoDTO, UpdateTodoDTO } from "./todo.schema";
import { AuthGuard } from "../../core/guard";

export const todoRoutes = new Elysia({ prefix: "todos" })
  .derive(AuthGuard.derive)
  .get("/", TodoController.list)
  .post("/", TodoController.create, { body: CreateTodoDTO })
  .get("/:id", TodoController.get)
  .put("/:id", TodoController.update, { body: UpdateTodoDTO })
  .delete("/:id", TodoController.remove);

