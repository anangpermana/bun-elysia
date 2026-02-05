import { db } from "../../config/db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { hashPassword, comparePassword } from "../../core/hash";
import type { RegisterData, LoginData } from "./auth.schema";
import { AuthError } from "../../core/errors";

export interface AuthenticatedUser {
  id: number;
  email: string;
  name: string | null;
}

export const AuthService = {
  register: async (data: RegisterData): Promise<AuthenticatedUser> => {
    // Cek apakah email sudah terdaftar
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, data.email));

    if (existing) throw new AuthError("Email already registered", 409);

    const hashed = await hashPassword(data.password);

    const [user] = await db
      .insert(users)
      .values({
        email: data.email,
        name: data.name,
        password: hashed,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
      });

    if (!user) throw new AuthError("Registration failed", 500);

    return user;
  },

  login: async (data: LoginData): Promise<AuthenticatedUser> => {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        password: users.password,
      })
      .from(users)
      .where(eq(users.email, data.email));

    if (!user) throw new AuthError("User not found", 404);

    const match = await comparePassword(data.password, user.password);
    if (!match) throw new AuthError("Invalid password", 401);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },

  profile: async (id: number) => {
    const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email
    })
    .from(users)
    .where(eq(users.id, id));

    return {
      id: user?.id,
      email: user?.email,
      name: user?.name,
    };
  }
};
