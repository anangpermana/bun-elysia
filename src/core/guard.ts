import { AuthError } from "../core/errors";

export const AuthGuard = {
  // derive: ekstrak user dari JWT → simpan di context.authUser
  derive: async ({ request, jwt }:any) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthError("Unauthorized", 401);
  }

  const token = authHeader.substring(7);
  const payload = await jwt.verify(token);
  
  if (!payload) throw new AuthError("Invalid token", 401);

  // 🔍 Cek & ambil id dari berbagai kemungkinan lokasi
  let id: number | undefined;

  // Coba dari payload.id (utama)
  id = typeof payload.id === 'number' ? payload.id 
      : typeof payload.id === 'string' ? Number(payload.id)
      : undefined;

  // Jika masih undefined, coba dari sub atau nested user.id
  if (id == null || isNaN(id)) {
    id = typeof payload.sub === 'string' ? Number(payload.sub) : undefined;
  }
  if (id == null || isNaN(id)) {
    id = payload.user?.id;
    if (typeof id === 'string') id = Number(id);
  }

  if (!id || id <= 0 || isNaN(id)) {
    console.error("AuthGuard: Invalid or missing user ID in token", payload);
    throw new AuthError("Invalid user credentials", 401);
  }

  // console.log("✅ JWT payload:", payload);
  // console.log("✅ Extracted ID:", id);
  return {
    authUser: {
      ...payload,
      id, // ✅ pastikan selalu number
    }
  };
}

  // guard: memaksa derive berjalan & throw jika gagal
  // cukup pakai derive saja di route, tapi guard bisa dipakai untuk grouping
};