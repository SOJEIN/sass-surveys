import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/ws',
  cors: {
    origin: true, // Permitir todos los orígenes en desarrollo
    credentials: true,
  },
})
export class RealtimeGateway {
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(RealtimeGateway.name);

  // ============ SURVEYS ============
  @SubscribeMessage('survey:join')
  handleJoin(client: Socket, payload: { surveyId: string }) {
    const room = `survey:${payload.surveyId}`;
    client.join(room);
    client.emit('survey:joined', { room });
    this.logger.log(`Client ${client.id} joined room: ${room}`);
  }

  emitSurveyUpdate(surveyId: string) {
    const room = `survey:${surveyId}`;
    this.server.to(room).emit('survey:update', { surveyId });
    this.server.emit('survey:update', { surveyId }); // broadcast fallback
    this.logger.log(`Survey update emitted for: ${surveyId}`);
  }

  // ============ SUMMARY ALL TO USERS ============
  @SubscribeMessage('users:join')
  handleUsersJoin(client: Socket) {
    const room = 'summary-users';
    client.join(room);
    client.emit('users:joined', { room });
    this.logger.log(`Client ${client.id} joined users room`);
  }

  @SubscribeMessage('users:leave')
  handleUsersLeave(client: Socket) {
    const room = 'summary-users';
    client.leave(room);
    this.logger.log(`Client ${client.id} left users room`);
  }

  // Emitir cuando se crea un usuario
  emitUserCreated(user: any) {
    const room = 'summary-users';
    this.server.to(room).emit('user:created', user);
    this.server.emit('user:created', user); // broadcast fallback
    this.logger.log(`User created event emitted: ${user.id}`);
  }

  // Emitir cuando se actualiza un usuario
  emitUserUpdated(user: any) {
    const room = 'summary-users';
    this.server.to(room).emit('user:updated', user);
    this.server.emit('user:updated', user); // broadcast fallback
    this.logger.log(`User updated event emitted: ${user.id}`);
  }

  // Emitir cuando se elimina un usuario
  emitUserDeleted(userId: number) {
    const room = 'summary-users';
    this.server.to(room).emit('user:deleted', { id: userId });
    this.server.emit('user:deleted', { id: userId }); // broadcast fallback
    this.logger.log(`User deleted event emitted: ${userId}`);
  }

  // Emitir estadísticas en tiempo real
  emitUsersStats(stats: any) {
    const room = 'summary-users';
    this.server.to(room).emit('users:stats', stats);
    this.server.emit('users:stats', stats); // broadcast fallback
    this.logger.log('Users stats emitted');
  }

  // ============ CONEXIÓN ============
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
