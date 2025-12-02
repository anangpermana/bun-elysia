// server.ts
import { app } from "./app";
import { Server } from "socket.io";
import { createServer } from "http";
import { registerChatSocket } from "./modules/chat/chat.socket";

// Buat HTTP server manual
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

registerChatSocket(io);

// EVENT SOCKET.IO
// io.on("connection", (socket) => {
//   console.log("🔌 Client connected:", socket.id);

//   socket.on("chat:send", (msg) => {
//     console.log("Pesan diterima:", msg);

//     // broadcast ke semua client lain
//     socket.broadcast.emit("chat:receive", msg);
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ Client disconnected:", socket.id);
//   });
// });

// JALANKAN ELYSIA DI ROUTE YANG SAMA
app.handle = app.handle.bind(app);

httpServer.on("request", app.handle);

// LISTEN
httpServer.listen(3000, () => {
  console.log("⚡ Server ready at http://localhost:3000");
  console.log("💬 WebSocket ready at ws://localhost:3000");
});
