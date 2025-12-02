// src/socket.ts
import { Server } from "socket.io";
import { registerChatSocket } from "./modules/chat/chat.socket";

const io = new Server(3001, {
  cors: { origin: "*" },
});

registerChatSocket(io);

// io.on("connection", (socket) => {
//   console.log("🔌 client connected", socket.id);

//   socket.on("chat:send", (msg) => {
//     io.emit("chat:receive", msg);
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ client disconnected", socket.id);
//   });
// });

console.log("💬 Socket.IO running at ws://localhost:3001");
