import { AuthError } from "../core/errors";

export const AuthGuard = {
  // derive: ekstrak user dari JWT → simpan di context.authUser
  derive: ({
    request,
    jwt,
  }: any) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthError("Unauthorized", 401);
    }

    const token = authHeader.substring(7); // hapus "Bearer "

    // verify & decode
    const payload = jwt.verify(token);
    if (!payload) {
      throw new AuthError("Invalid token", 401);
    }

    return {
      authUser: payload, // akan tersedia di context.authUser
    };
  },

  // guard: memaksa derive berjalan & throw jika gagal
  // cukup pakai derive saja di route, tapi guard bisa dipakai untuk grouping
};