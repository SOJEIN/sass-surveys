# 🔴 WebSocket & Analytics en Tiempo Real - Summary All To Users

## ✅ Estado de Configuración

### ✔️ WebSocket Gateway

- **URL**: `ws://localhost:3000/ws`
- **Namespace**: `/ws`
- **CORS**: Habilitado para todos los orígenes en desarrollo

### ✔️ Eventos Configurados

- ✅ Crear usuario → `user:created`
- ✅ Actualizar usuario → `user:updated`
- ✅ Eliminar usuario → `user:deleted`
- ✅ Estadísticas en tiempo real → `users:stats`

### ✔️ Integración

- ✅ Servicio actualizado con eventos
- ✅ Módulo configurado con RealtimeModule
- ✅ Analytics endpoint disponible

---

## 📡 Eventos WebSocket Disponibles

### 1. Unirse a la sala de usuarios

**Cliente → Servidor**

```javascript
socket.emit('users:join');
```

**Servidor → Cliente**

```javascript
socket.on('users:joined', (data) => {
  console.log(data); // { room: 'summary-users' }
});
```

---

### 2. Usuario Creado

**Se emite automáticamente cuando se crea un usuario**

```javascript
socket.on('user:created', (user) => {
  console.log('Nuevo usuario:', user);
  /*
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    correo: "juan@email.com",
    edad: 25,
    comidaFavorita: "Pizza",
    genero: "MASCULINO",
    createdAt: "2025-11-10T...",
    updatedAt: "2025-11-10T..."
  }
  */
});
```

---

### 3. Usuario Actualizado

**Se emite automáticamente cuando se actualiza un usuario**

```javascript
socket.on('user:updated', (user) => {
  console.log('Usuario actualizado:', user);
  // Misma estructura que user:created
});
```

---

### 4. Usuario Eliminado

**Se emite automáticamente cuando se elimina un usuario**

```javascript
socket.on('user:deleted', (data) => {
  console.log('Usuario eliminado:', data);
  // { id: 1 }
});
```

---

### 5. Estadísticas en Tiempo Real

**Se emite automáticamente después de cada operación (crear/actualizar/eliminar)**

```javascript
socket.on('users:stats', (stats) => {
  console.log('Estadísticas actualizadas:', stats);
  /*
  {
    total: 10,
    byGender: [
      { genero: "MASCULINO", count: 6 },
      { genero: "FEMENINO", count: 3 },
      { genero: "OTRO", count: 1 }
    ],
    ageStats: {
      average: 28.5,
      min: 18,
      max: 65
    },
    recentUsers: [
      { id: 10, nombre: "...", apellido: "...", genero: "...", createdAt: "..." },
      ...
    ],
    timestamp: "2025-11-10T15:30:00.000Z"
  }
  */
});
```

---

## 🎯 Cliente WebSocket Completo (JavaScript/HTML)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Summary Users - Real Time</title>
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
      }
      .log {
        background: #f0f0f0;
        padding: 10px;
        margin: 10px 0;
        border-radius: 5px;
      }
      .created {
        border-left: 4px solid #4caf50;
      }
      .updated {
        border-left: 4px solid #2196f3;
      }
      .deleted {
        border-left: 4px solid #f44336;
      }
      .stats {
        border-left: 4px solid #ff9800;
      }
    </style>
  </head>
  <body>
    <h1>Summary Users - WebSocket Monitor</h1>
    <div id="status">Connecting...</div>
    <div id="logs"></div>

    <script>
      const socket = io('http://localhost:3000/ws');
      const logsDiv = document.getElementById('logs');
      const statusDiv = document.getElementById('status');

      function addLog(message, type = 'info', data = null) {
        const logDiv = document.createElement('div');
        logDiv.className = `log ${type}`;
        const time = new Date().toLocaleTimeString();
        logDiv.innerHTML = `
        <strong>${time}</strong> - ${message}
        ${data ? `<pre>${JSON.stringify(data, null, 2)}</pre>` : ''}
      `;
        logsDiv.insertBefore(logDiv, logsDiv.firstChild);

        // Limitar a 20 logs
        while (logsDiv.children.length > 20) {
          logsDiv.removeChild(logsDiv.lastChild);
        }
      }

      // Conectar al WebSocket
      socket.on('connect', () => {
        statusDiv.innerHTML = '🟢 <strong>Conectado</strong>';
        statusDiv.style.color = 'green';
        addLog('Conectado al servidor WebSocket');

        // Unirse a la sala de usuarios
        socket.emit('users:join');
      });

      socket.on('disconnect', () => {
        statusDiv.innerHTML = '🔴 <strong>Desconectado</strong>';
        statusDiv.style.color = 'red';
        addLog('Desconectado del servidor');
      });

      // Confirmación de unión a la sala
      socket.on('users:joined', (data) => {
        addLog('Unido a la sala de usuarios', 'info', data);
      });

      // Usuario creado
      socket.on('user:created', (user) => {
        addLog(
          `✅ Usuario creado: ${user.nombre} ${user.apellido}`,
          'created',
          user,
        );
      });

      // Usuario actualizado
      socket.on('user:updated', (user) => {
        addLog(
          `📝 Usuario actualizado: ${user.nombre} ${user.apellido}`,
          'updated',
          user,
        );
      });

      // Usuario eliminado
      socket.on('user:deleted', (data) => {
        addLog(`🗑️ Usuario eliminado (ID: ${data.id})`, 'deleted', data);
      });

      // Estadísticas actualizadas
      socket.on('users:stats', (stats) => {
        addLog(
          `📊 Estadísticas actualizadas - Total: ${stats.total}`,
          'stats',
          stats,
        );
      });

      // Manejo de errores
      socket.on('error', (error) => {
        addLog('❌ Error en WebSocket', 'error', error);
      });
    </script>
  </body>
</html>
```

Guarda esto como `websocket-test.html` y ábrelo en tu navegador.

---

## 🎯 Cliente React/Vue/Angular

### React Hooks

```javascript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function UsersRealtime() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:3000/ws');

    socket.on('connect', () => {
      console.log('Connected');
      socket.emit('users:join');
    });

    socket.on('user:created', (user) => {
      setUsers((prev) => [user, ...prev]);
    });

    socket.on('user:updated', (user) => {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
    });

    socket.on('user:deleted', (data) => {
      setUsers((prev) => prev.filter((u) => u.id !== data.id));
    });

    socket.on('users:stats', (newStats) => {
      setStats(newStats);
    });

    return () => {
      socket.emit('users:leave');
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Estadísticas</h2>
      {stats && (
        <div>
          <p>Total: {stats.total}</p>
          <p>Edad promedio: {stats.ageStats.average}</p>
        </div>
      )}

      <h2>Usuarios</h2>
      {users.map((user) => (
        <div key={user.id}>
          {user.nombre} {user.apellido} - {user.genero}
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 Endpoint de Analytics

### Obtener Estadísticas

```http
GET /api/summary-all-to-users/stats
```

**Respuesta:**

```json
{
  "total": 10,
  "byGender": [
    { "genero": "MASCULINO", "count": 6 },
    { "genero": "FEMENINO", "count": 3 },
    { "genero": "OTRO", "count": 1 }
  ],
  "ageStats": {
    "average": 28.5,
    "min": 18,
    "max": 65
  },
  "recentUsers": [
    {
      "id": 10,
      "nombre": "María",
      "apellido": "González",
      "genero": "FEMENINO",
      "createdAt": "2025-11-10T15:30:00.000Z"
    }
  ],
  "timestamp": "2025-11-10T15:30:00.000Z"
}
```

---

## 🧪 Testing de WebSocket

### 1. Usando el Debug Controller

#### Test: Emitir usuario creado

```bash
curl -X POST http://localhost:3000/api/debug-ws/emit-user-created
```

#### Test: Emitir usuario actualizado

```bash
curl -X POST http://localhost:3000/api/debug-ws/emit-user-updated
```

#### Test: Emitir usuario eliminado

```bash
curl -X POST http://localhost:3000/api/debug-ws/emit-user-deleted/999
```

#### Info de eventos disponibles

```bash
curl http://localhost:3000/api/debug-ws/info
```

---

### 2. Testing Real con Operaciones CRUD

**Terminal 1: Iniciar servidor**

```bash
npm run start:dev
```

**Terminal 2: Abrir cliente WebSocket**

- Abre `websocket-test.html` en tu navegador
- O usa el endpoint: `GET http://localhost:3000/api/debug-ws/info` para ver el HTML de ejemplo

**Terminal 3: Hacer operaciones CRUD**

```bash
# Crear usuario (deberías ver el evento en el cliente)
curl -X POST http://localhost:3000/api/summary-all-to-users \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","apellido":"Pérez","correo":"juan@test.com","genero":"MASCULINO"}'

# Actualizar usuario
curl -X PATCH http://localhost:3000/api/summary-all-to-users/1 \
  -H "Content-Type: application/json" \
  -d '{"edad":26}'

# Eliminar usuario
curl -X DELETE http://localhost:3000/api/summary-all-to-users/1
```

---

## ✅ Verificación de Funcionamiento

### Checklist:

1. ✅ **WebSocket Gateway configurado** con eventos para usuarios
2. ✅ **Servicio integrado** emite eventos en cada operación CRUD
3. ✅ **Analytics endpoint** (`/stats`) disponible
4. ✅ **CORS configurado** para permitir conexiones WebSocket
5. ✅ **Debug endpoints** para testing
6. ✅ **Estadísticas en tiempo real** se calculan y emiten automáticamente

---

## 🔧 Configuración Adicional

### Instalar Socket.IO en el Frontend

```bash
npm install socket.io-client
```

### Configuración de CORS para WebSocket

Ya está configurado en `realtime.gateway.ts`:

```typescript
cors: {
  origin: true, // Permite todos los orígenes en desarrollo
  credentials: true,
}
```

---

## 📝 Flujo Completo

1. **Cliente se conecta** al WebSocket
2. **Cliente emite** `users:join` para unirse a la sala
3. **Servidor confirma** con `users:joined`
4. **Cuando se crea/actualiza/elimina un usuario**:
   - El servicio ejecuta la operación en la BD
   - Emite el evento correspondiente (`user:created`, `user:updated`, `user:deleted`)
   - Calcula y emite estadísticas actualizadas (`users:stats`)
5. **Todos los clientes conectados** reciben los eventos en tiempo real

---

## 🎉 ¡Todo Está Configurado!

Tu tabla `SummaryAllToUsers` ahora tiene:

- ✅ CRUD completo con validaciones
- ✅ WebSocket en tiempo real para todos los eventos
- ✅ Analytics con estadísticas actualizadas
- ✅ Endpoints de debug para testing
- ✅ CORS configurado correctamente

**Para probarlo ahora:**

1. Ejecuta el servidor: `npm run start:dev`
2. Abre Swagger: `http://localhost:3000/api/docs`
3. Ve a Debug WebSocket y obtén el HTML de ejemplo
4. Realiza operaciones CRUD y observa los eventos en tiempo real

¡Listo para usar! 🚀
