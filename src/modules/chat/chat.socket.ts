import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";

export function registerChatSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("🔌 Chat socket connected:", socket.id);

    // join room sesuai user id
    socket.on("auth", (userId: number) => {
      socket.join(`user:${userId}`);
      socket.data.userId = userId;
      console.log(`🟢 User ${userId} connected`);
    });

    // menerima pesan
    socket.on("chat:send", async (data) => {
      console.log('socket', socket.data)
      const { receiverId, message } = data;
      const senderId = socket.data.userId;
      console.log('sender type', typeof(senderId))
      console.log('receive type', typeof(receiverId))
      console.log('sender', senderId)
      console.log('receive', receiverId)
      console.log('message', message)
      if (!senderId) return;

      const saved = await ChatService.sendMessage(senderId, receiverId, message);

      // kirim ke receiver
      io.to(`user:${receiverId}`).emit("chat:receive", saved);

      // kirim balik ke pengirim (untuk update UI)
      io.to(`user:${senderId}`).emit("chat:sent", saved);
    });

    socket.on("disconnect", () => {
      console.log("❌ Chat socket disconnected:", socket.id);
    });
  });
}
