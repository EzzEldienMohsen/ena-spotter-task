// Socket.io server initialization
import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import type { TypedServer } from './types/websocket.types';

let io: TypedServer | null = null;

export function initializeSocketServer(httpServer: HTTPServer): TypedServer {
  if (io) {
    return io;
  }

  io = new SocketServer(httpServer, {
    path: '/api/socket',
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  }) as TypedServer;

  console.log('[WebSocket] Socket.io server initialized at /api/socket');

  return io;
}

export function getSocketServer(): TypedServer | null {
  return io;
}
