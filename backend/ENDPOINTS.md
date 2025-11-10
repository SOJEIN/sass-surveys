# 📡 Documentación de Endpoints - SaaS Surveys API

## 🌐 Base URL

```
http://localhost:3000/api
```

## ✅ CORS Solucionado

La configuración de CORS ahora permite:

- **Desarrollo (NODE_ENV != production)**: Todos los orígenes permitidos
- **Producción**: Solo orígenes específicos en `CORS_ORIGIN`

---

## 📋 Módulos Disponibles

### 1️⃣ Summary All To Users (CRUD Completo)

### 2️⃣ Public Surveys (Encuestas Públicas)

### 3️⃣ Analytics (Análisis y Estadísticas)

### 4️⃣ Realtime (WebSockets)

---

## 1️⃣ SUMMARY ALL TO USERS

Base: `/api/summary-all-to-users`

### 📌 Crear Usuario

```http
POST /api/summary-all-to-users
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan.perez@email.com",
  "edad": 25,
  "comidaFavorita": "Pizza",
  "genero": "MASCULINO"
}
```

**Respuestas:**

- ✅ `201 Created`: Usuario creado exitosamente
- ❌ `409 Conflict`: El correo ya está registrado
- ❌ `400 Bad Request`: Datos inválidos

**Ejemplo de respuesta exitosa:**

```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan.perez@email.com",
  "edad": 25,
  "comidaFavorita": "Pizza",
  "genero": "MASCULINO",
  "createdAt": "2025-11-10T10:30:00.000Z",
  "updatedAt": "2025-11-10T10:30:00.000Z"
}
```

---

### 📌 Obtener Todos los Usuarios

```http
GET /api/summary-all-to-users
```

**Respuestas:**

- ✅ `200 OK`: Lista de usuarios

**Ejemplo de respuesta:**

```json
[
  {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan.perez@email.com",
    "edad": 25,
    "comidaFavorita": "Pizza",
    "genero": "MASCULINO",
    "createdAt": "2025-11-10T10:30:00.000Z",
    "updatedAt": "2025-11-10T10:30:00.000Z"
  },
  {
    "id": 2,
    "nombre": "María",
    "apellido": "González",
    "correo": "maria.gonzalez@email.com",
    "edad": 30,
    "comidaFavorita": "Tacos",
    "genero": "FEMENINO",
    "createdAt": "2025-11-10T10:35:00.000Z",
    "updatedAt": "2025-11-10T10:35:00.000Z"
  }
]
```

---

### 📌 Obtener Usuario por ID

```http
GET /api/summary-all-to-users/:id
```

**Ejemplo:**

```http
GET /api/summary-all-to-users/1
```

**Respuestas:**

- ✅ `200 OK`: Usuario encontrado
- ❌ `404 Not Found`: Usuario no existe

---

### 📌 Actualizar Usuario

```http
PATCH /api/summary-all-to-users/:id
Content-Type: application/json

{
  "edad": 26,
  "comidaFavorita": "Hamburguesa"
}
```

**Notas:**

- Todos los campos son opcionales
- Solo se actualizan los campos enviados

**Respuestas:**

- ✅ `200 OK`: Usuario actualizado
- ❌ `404 Not Found`: Usuario no existe
- ❌ `409 Conflict`: Correo duplicado (si se intenta cambiar a uno existente)

---

### 📌 Eliminar Usuario

```http
DELETE /api/summary-all-to-users/:id
```

**Ejemplo:**

```http
DELETE /api/summary-all-to-users/1
```

**Respuestas:**

- ✅ `200 OK`: Usuario eliminado
- ❌ `404 Not Found`: Usuario no existe

**Ejemplo de respuesta:**

```json
{
  "message": "Usuario con ID 1 eliminado exitosamente"
}
```

---

## 2️⃣ PUBLIC SURVEYS

Base: `/api/public-surveys`

### 📌 Obtener Encuesta Pública

```http
GET /api/public-surveys/:slug
```

**Ejemplo:**

```http
GET /api/public-surveys/encuesta-satisfaccion-2024
```

**Respuestas:**

- ✅ `200 OK`: Encuesta encontrada
- ❌ `404 Not Found`: Encuesta no existe o no es pública

---

### 📌 Enviar Respuesta a Encuesta

```http
POST /api/public-surveys/:slug/responses
Content-Type: application/json

{
  "respondentId": "usuario123",
  "answers": [
    {
      "questionId": "q1",
      "textValue": "Muy satisfecho"
    },
    {
      "questionId": "q2",
      "optionId": "opt1"
    },
    {
      "questionId": "q3",
      "numberValue": 9
    }
  ]
}
```

**Respuestas:**

- ✅ `201 Created`: Respuesta enviada
- ❌ `404 Not Found`: Encuesta no existe
- ❌ `400 Bad Request`: Datos inválidos

---

## 3️⃣ ANALYTICS

Base: `/api/analytics/surveys`

### 📌 Obtener Todas las Summaries de Encuestas

```http
GET /api/analytics/surveys
```

**Descripción:** Obtiene estadísticas y análisis de todas las encuestas registradas.

**Respuestas:**

- ✅ `200 OK`: Lista de summaries

**Ejemplo de respuesta:**

```json
[
  {
    "survey": {
      "id": "survey1",
      "title": "Encuesta de Satisfacción",
      "status": "PUBLISHED"
    },
    "questions": [
      {
        "questionId": "q1",
        "title": "¿Cómo calificarías nuestro servicio?",
        "type": "RATING",
        "count": 150,
        "average": 4.5,
        "sum": 675
      },
      {
        "questionId": "q2",
        "title": "¿Cuál es tu producto favorito?",
        "type": "SINGLE_CHOICE",
        "total": 150,
        "options": [
          {
            "optionId": "opt1",
            "label": "Producto A",
            "count": 80
          },
          {
            "optionId": "opt2",
            "label": "Producto B",
            "count": 70
          }
        ]
      }
    ]
  }
]
```

---

### 📌 Obtener Summary de una Encuesta Específica

```http
GET /api/analytics/surveys/:id/summary
```

**Ejemplo:**

```http
GET /api/analytics/surveys/clx123456/summary
```

**Respuestas:**

- ✅ `200 OK`: Summary de la encuesta
- ❌ `404 Not Found`: Encuesta no existe

**Tipos de Análisis por Tipo de Pregunta:**

#### SINGLE_CHOICE / MULTIPLE_CHOICE

```json
{
  "questionId": "q1",
  "title": "¿Cuál es tu color favorito?",
  "type": "SINGLE_CHOICE",
  "total": 100,
  "options": [
    { "optionId": "opt1", "label": "Rojo", "count": 45 },
    { "optionId": "opt2", "label": "Azul", "count": 55 }
  ]
}
```

#### RATING / NUMBER

```json
{
  "questionId": "q2",
  "title": "Califica del 1 al 10",
  "type": "RATING",
  "count": 100,
  "average": 8.5,
  "sum": 850
}
```

#### SHORT_TEXT / LONG_TEXT

```json
{
  "questionId": "q3",
  "title": "Comentarios adicionales",
  "type": "LONG_TEXT",
  "count": 50,
  "samples": ["Excelente servicio", "Muy buena atención", "Recomendado"]
}
```

---

## 4️⃣ REALTIME (WebSockets)

### 📌 Debug WebSocket

```http
GET /api/debug-ws
```

Endpoint para probar la conexión WebSocket.

---

## 🔧 SWAGGER DOCUMENTATION

Documentación interactiva disponible en:

```
http://localhost:3000/api/docs
```

### OpenAPI JSON

```
http://localhost:3000/api/openapi.json
```

---

## 🎯 Ejemplos con cURL

### Summary All To Users

**Crear:**

```bash
curl -X POST http://localhost:3000/api/summary-all-to-users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@email.com",
    "edad": 25,
    "genero": "MASCULINO"
  }'
```

**Listar todos:**

```bash
curl http://localhost:3000/api/summary-all-to-users
```

**Obtener por ID:**

```bash
curl http://localhost:3000/api/summary-all-to-users/1
```

**Actualizar:**

```bash
curl -X PATCH http://localhost:3000/api/summary-all-to-users/1 \
  -H "Content-Type: application/json" \
  -d '{"edad": 26}'
```

**Eliminar:**

```bash
curl -X DELETE http://localhost:3000/api/summary-all-to-users/1
```

### Analytics

**Todas las summaries:**

```bash
curl http://localhost:3000/api/analytics/surveys
```

**Summary específica:**

```bash
curl http://localhost:3000/api/analytics/surveys/SURVEY_ID/summary
```

---

## 🎯 Ejemplos con JavaScript/Fetch

### Crear Usuario

```javascript
fetch('http://localhost:3000/api/summary-all-to-users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nombre: 'Juan',
    apellido: 'Pérez',
    correo: 'juan@email.com',
    edad: 25,
    genero: 'MASCULINO',
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error:', error));
```

### Obtener Todos los Usuarios

```javascript
fetch('http://localhost:3000/api/summary-all-to-users')
  .then((response) => response.json())
  .then((users) => console.log(users))
  .catch((error) => console.error('Error:', error));
```

### Actualizar Usuario

```javascript
fetch('http://localhost:3000/api/summary-all-to-users/1', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    edad: 26,
    comidaFavorita: 'Sushi',
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error:', error));
```

### Obtener Analytics

```javascript
fetch('http://localhost:3000/api/analytics/surveys')
  .then((response) => response.json())
  .then((summaries) => console.log(summaries))
  .catch((error) => console.error('Error:', error));
```

---

## 🛡️ Configuración de CORS

### Archivo: `src/main.ts`

**Desarrollo (por defecto):**

- Permite todos los orígenes
- No requiere configuración adicional

**Producción:**

- Define en `.env`:

```env
NODE_ENV=production
CORS_ORIGIN=https://tu-dominio.com,https://www.tu-dominio.com
```

---

## 📝 Validaciones

### Summary All To Users

**Campos Obligatorios:**

- `nombre`: String no vacío
- `apellido`: String no vacío
- `correo`: Email válido y único
- `genero`: Enum (MASCULINO, FEMENINO, OTRO)

**Campos Opcionales:**

- `edad`: Entero ≥ 0
- `comidaFavorita`: String

---

## ⚠️ Códigos de Error Comunes

| Código | Descripción           | Solución                          |
| ------ | --------------------- | --------------------------------- |
| 400    | Bad Request           | Verifica el formato de los datos  |
| 404    | Not Found             | El recurso no existe              |
| 409    | Conflict              | Correo duplicado                  |
| 500    | Internal Server Error | Error del servidor, verifica logs |

---

## 🔍 Testing Rápido

### PowerShell (script incluido)

```powershell
.\test-summary-users.ps1
```

### Postman Collection

Importa los endpoints desde Swagger:

```
http://localhost:3000/api/docs
```

---

## 📊 Resumen de Endpoints

| Método | Endpoint                              | Descripción           |
| ------ | ------------------------------------- | --------------------- |
| POST   | `/api/summary-all-to-users`           | Crear usuario         |
| GET    | `/api/summary-all-to-users`           | Listar usuarios       |
| GET    | `/api/summary-all-to-users/:id`       | Obtener usuario       |
| PATCH  | `/api/summary-all-to-users/:id`       | Actualizar usuario    |
| DELETE | `/api/summary-all-to-users/:id`       | Eliminar usuario      |
| GET    | `/api/analytics/surveys`              | Todas las summaries   |
| GET    | `/api/analytics/surveys/:id/summary`  | Summary específica    |
| GET    | `/api/public-surveys/:slug`           | Obtener encuesta      |
| POST   | `/api/public-surveys/:slug/responses` | Enviar respuesta      |
| GET    | `/api/docs`                           | Documentación Swagger |

---

¡Ahora puedes usar la API sin problemas de CORS! 🚀
