import type { Elysia } from "elysia";
import { AuthService } from "./auth.service";
import { AuthError } from "../../core/errors";

// request body type
import type { RegisterData, LoginData } from "./auth.schema";

export const AuthController = {
  register: async (context: { body: RegisterData }) => {
    try {
      const user = await AuthService.register(context.body);
      return { message: "Registered", user };
    } catch (err) {
      if (err instanceof AuthError) return new Response(err.message, { status: err.status });
      return new Response("Internal server error", { status: 500 });
    }
  },

  login: async (context: any) => {
    try {
      const { body } = context; // body sudah ada
      const user = await AuthService.login(body);

      // jwt diakses dari context.app.jwt atau context.jwt.sign macro
      const token = await context.jwt.sign({ id: user.id, email: user.email });
      return {
        success: true,
        message: 'Login Successfull',
        data: {
          user,
          tokens: {
            access_token: token,
            token_type: "bearer",
            expires_in: 3600
          }
        }
      }
      
    } catch (err) {
      console.log('err', err);
      if (err instanceof AuthError) return new Response(err.message, { status: err.status });
      return new Response("Internal server error", { status: 500 });
    }
  },

  profile: async (context: any) => {
    try {
      // Ambil Authorization header
      const authHeader = context.request.headers.get("authorization");
      if (!authHeader) throw new AuthError("Unauthorized", 401);

      const token = authHeader.replace("Bearer ", "");

      // Verifikasi token lewat plugin JWT
      const payload = await context.jwt.verify(token);
      if (!payload) throw new AuthError("Unauthorized", 401);
      const profile = await AuthService.profile(payload.id);

      return { user: profile };
    } catch (err) {
      if (err instanceof AuthError) {
        return new Response(err.message, { status: err.status });
      }
      return new Response("Internal server error", { status: 500 });
    }
  },
};
