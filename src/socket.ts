// src/socket.ts
import { Server as Engine } from '@socket.io/bun-engine';
import { Server } from 'socket.io';

//Inisialisasi engine & Socket.IO

export const engine = new Engine({
  path: '/socket.io/',
  cors: {
    origin: '*',
    credentials: true,
  },
});

export const io = new Server();
io.bind(engine);

console.log('Socket.IO ready')