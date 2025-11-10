import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RealtimeGateway } from './realtime.gateway';

@ApiTags('Debug WebSocket')
@Controller('debug-ws')
export class DebugWsController {
  constructor(private readonly ws: RealtimeGateway) {}

  @Post('emit/:surveyId')
  @ApiOperation({ summary: 'Emitir actualización de survey para testing' })
  emit(@Param('surveyId') surveyId: string) {
    this.ws.emitSurveyUpdate(surveyId);
    return { ok: true, surveyId };
  }

  @Post('emit-user-created')
  @ApiOperation({ summary: 'Emitir evento de usuario creado para testing' })
  emitUserCreated() {
    const testUser = {
      id: 999,
      nombre: 'Test',
      apellido: 'User',
      correo: 'test@example.com',
      edad: 25,
      genero: 'MASCULINO',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.ws.emitUserCreated(testUser);
    return { ok: true, event: 'user:created', user: testUser };
  }

  @Post('emit-user-updated')
  @ApiOperation({
    summary: 'Emitir evento de usuario actualizado para testing',
  })
  emitUserUpdated() {
    const testUser = {
      id: 999,
      nombre: 'Test Updated',
      apellido: 'User',
      correo: 'test@example.com',
      edad: 26,
      genero: 'MASCULINO',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.ws.emitUserUpdated(testUser);
    return { ok: true, event: 'user:updated', user: testUser };
  }

  @Post('emit-user-deleted/:id')
  @ApiOperation({ summary: 'Emitir evento de usuario eliminado para testing' })
  emitUserDeleted(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    this.ws.emitUserDeleted(userId);
    return { ok: true, event: 'user:deleted', userId };
  }

  @Get('info')
  @ApiOperation({ summary: 'Información sobre eventos disponibles' })
  getInfo() {
    return {
      websocket: {
        url: 'ws://localhost:3000/ws',
        namespace: '/ws',
      },
      events: {
        surveys: {
          join: 'survey:join',
          joined: 'survey:joined',
          update: 'survey:update',
        },
        users: {
          join: 'users:join',
          leave: 'users:leave',
          joined: 'users:joined',
          created: 'user:created',
          updated: 'user:updated',
          deleted: 'user:deleted',
          stats: 'users:stats',
        },
      },
      exampleClient: {
        html: `
<!DOCTYPE html>
<html>
<head>
  <title>WebSocket Test</title>
  <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
  <h1>WebSocket Test Client</h1>
  <div id="log"></div>
  <script>
    const socket = io('http://localhost:3000/ws');
    const log = document.getElementById('log');
    
    function addLog(msg) {
      const p = document.createElement('p');
      p.textContent = new Date().toLocaleTimeString() + ': ' + msg;
      log.appendChild(p);
    }
    
    socket.on('connect', () => {
      addLog('Connected to WebSocket');
      socket.emit('users:join');
    });
    
    socket.on('users:joined', (data) => {
      addLog('Joined room: ' + JSON.stringify(data));
    });
    
    socket.on('user:created', (user) => {
      addLog('User created: ' + JSON.stringify(user));
    });
    
    socket.on('user:updated', (user) => {
      addLog('User updated: ' + JSON.stringify(user));
    });
    
    socket.on('user:deleted', (data) => {
      addLog('User deleted: ' + JSON.stringify(data));
    });
    
    socket.on('users:stats', (stats) => {
      addLog('Stats updated: ' + JSON.stringify(stats));
    });
  </script>
</body>
</html>
        `,
      },
    };
  }
}
