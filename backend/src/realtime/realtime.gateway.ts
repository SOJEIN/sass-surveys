import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/ws',
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: false,
  },
})
export class RealtimeGateway {
  @WebSocketServer() server!: Server;

  @SubscribeMessage('survey:join')
  handleJoin(client: Socket, payload: { surveyId: string }) {
    const room = `survey:${payload.surveyId}`;
    client.join(room);
    client.emit('survey:joined', { room });
  }

  emitSurveyUpdate(surveyId: string) {
    const room = `survey:${surveyId}`;
    this.server.to(room).emit('survey:update', { surveyId });
    this.server.emit('survey:update', { surveyId }); // broadcast fallback
  }
}
