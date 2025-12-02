import { Elysia } from "elysia";
import { AuthController } from "./auth.controller";
import { RegisterDTO, LoginDTO } from "./auth.schema";

export const authRoutes = new Elysia({ prefix: "auth" })
  .post("/register", async (context) => AuthController.register(context), { body: RegisterDTO })
  .post("/login", async (context) => AuthController.login(context), { body: LoginDTO })
  .get("/profile", async (context) => AuthController.profile(context));
