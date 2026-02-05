import { t } from "elysia";
import type { Static } from "@sinclair/typebox";

export const RegisterDTO = t.Object({
  email: t.String({ format: "email" }),
  name: t.String({ minLength: 2 }),
  password: t.String({ minLength: 6 }),
});

export const LoginDTO = t.Object({
  email: t.String(),
  password: t.String(),
});

export const ProfileDTO = t.Object({
  id: t.Number(),
  name: t.String(),
  email: t.String()
});

export type RegisterData = Static<typeof RegisterDTO>;
export type LoginData = Static<typeof LoginDTO>;
export type ProfileData = Static<typeof ProfileDTO>;
