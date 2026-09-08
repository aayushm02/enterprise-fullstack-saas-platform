import { Server as HttpServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { UserPayload } from '../types';

export class SocketServer {
  private static io: IOServer | null = null;

  static initialize(httpServer: HttpServer) {
    this.io = new IOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    // JWT authentication middleware for WebSocket connections
    this.io.use((socket: Socket, next) => {
      const token = socket.handshake.auth.token || socket.handshake.headers['authorization'];

      if (!token) {
        return next(new Error('WebSocket Authentication Failed: Token missing'));
      }

      const rawToken = token.startsWith('Bearer ') ? token.slice(7) : token;

      try {
        const decoded = jwt.verify(rawToken, ENV.JWT_SECRET) as UserPayload;
        (socket as any).user = decoded;
        next();
      } catch (err) {
        next(new Error('WebSocket Authentication Failed: Invalid token'));
      }
    });

    this.io.on('connection', (socket: Socket) => {
      const user = (socket as any).user as UserPayload;
      const tenantRoom = `tenant_${user.tenantId}`;

      // Join tenant-scoped room
      socket.join(tenantRoom);
      console.log(`[WS CONNECTED] User ${user.email} (${user.role}) joined ${tenantRoom}`);

      socket.on('disconnect', () => {
        console.log(`[WS DISCONNECTED] User ${user.email}`);
      });
    });

    console.log('[WEBSOCKET INITIALIZED] Multi-tenant event gateway ready.');
  }

  static emitToTenant(tenantId: string, event: string, payload: any) {
    if (this.io) {
      this.io.to(`tenant_${tenantId}`).emit(event, payload);
    }
  }
}
