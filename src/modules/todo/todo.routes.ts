import { Elysia, t } from "elysia";
import { TodoController } from "./todo.controller";
import { CreateTodoDTO, UpdateTodoDTO } from "./todo.schema";
import { AuthGuard } from "../../core/guard";

export const todoRoutes = new Elysia({ prefix: "todos" })
  .derive(AuthGuard.derive)
  .get("/", TodoController.list, 
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        search: t.Optional(t.String())
      })
    }
  )
  .post("/", TodoController.create, { body: CreateTodoDTO })
  .get("/:id", TodoController.get)
  .put("/:id", TodoController.update, { body: UpdateTodoDTO })
  .delete("/:id", TodoController.remove);

