import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  transports: ["websocket"]
});

socket.on("connect", () => {
  console.log("Connected!", socket.id);
  socket.emit("auth", 2);
  socket.emit("chat:send", {
        receiverId: 1,
        message: "pesan dari dua"
    })
});

socket.on("chat:receive", (msg) => {
  console.log("Message from 2:", msg);
});
