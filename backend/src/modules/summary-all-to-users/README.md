# Módulo Summary All To Users

## Descripción

CRUD completo para gestionar usuarios con información personal en NestJS usando Prisma y PostgreSQL.

## Modelo de Datos

### Tabla: `summary_all_to_users`

| Campo          | Tipo     | Descripción                         | Restricciones    |
| -------------- | -------- | ----------------------------------- | ---------------- |
| id             | Integer  | Identificador único autoincremental | PRIMARY KEY      |
| nombre         | String   | Nombre del usuario                  | NOT NULL         |
| apellido       | String   | Apellido del usuario                | NOT NULL         |
| correo         | String   | Correo electrónico                  | UNIQUE, NOT NULL |
| edad           | Integer  | Edad del usuario                    | OPCIONAL         |
| comidaFavorita | String   | Comida favorita                     | OPCIONAL         |
| genero         | Enum     | Género (MASCULINO, FEMENINO, OTRO)  | NOT NULL         |
| createdAt      | DateTime | Fecha de creación                   | AUTO             |
| updatedAt      | DateTime | Fecha de última actualización       | AUTO             |

## Instalación y Configuración

### 1. Configurar Base de Datos

Asegúrate de tener PostgreSQL corriendo. El archivo `.env` ya está configurado con:

```env
DATABASE_PUBLIC_URL="postgresql://postgres:password@localhost:5432/sass_surveys?schema=public"
```

**Ajusta la URL según tu configuración:**

- `postgres`: usuario de PostgreSQL
- `password`: contraseña
- `localhost:5432`: host y puerto
- `sass_surveys`: nombre de la base de datos

### 2. Ejecutar Migración

Una vez que PostgreSQL esté corriendo, ejecuta:

```bash
npx prisma migrate dev --name add_summary_all_to_users
```

Esto creará la tabla en la base de datos.

### 3. Generar Cliente de Prisma

Si aún no lo has hecho:

```bash
npx prisma generate
```

## API Endpoints

### Base URL

```
http://localhost:3000/summary-all-to-users
```

### Endpoints Disponibles

#### 1. Crear Usuario

```http
POST /summary-all-to-users
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

- `201`: Usuario creado exitosamente
- `409`: Correo duplicado
- `400`: Datos inválidos

#### 2. Obtener Todos los Usuarios

```http
GET /summary-all-to-users
```

**Respuesta:**

- `200`: Lista de usuarios

#### 3. Obtener Usuario por ID

```http
GET /summary-all-to-users/:id
```

**Respuestas:**

- `200`: Usuario encontrado
- `404`: Usuario no encontrado

#### 4. Actualizar Usuario

```http
PATCH /summary-all-to-users/:id
Content-Type: application/json

{
  "nombre": "Juan Carlos",
  "edad": 26
}
```

**Respuestas:**

- `200`: Usuario actualizado
- `404`: Usuario no encontrado
- `409`: Correo duplicado (si se intenta cambiar a uno existente)

#### 5. Eliminar Usuario

```http
DELETE /summary-all-to-users/:id
```

**Respuestas:**

- `200`: Usuario eliminado
- `404`: Usuario no encontrado

## Validaciones

Los DTOs incluyen validaciones automáticas:

### CreateSummaryAllToUserDto

- `nombre`: String obligatorio
- `apellido`: String obligatorio
- `correo`: Email válido y obligatorio
- `edad`: Entero opcional, debe ser ≥ 0
- `comidaFavorita`: String opcional
- `genero`: Enum obligatorio (MASCULINO, FEMENINO, OTRO)

### UpdateSummaryAllToUserDto

- Todos los campos son opcionales
- Mantiene las mismas validaciones cuando se proporcionan

## Manejo de Errores

El servicio incluye manejo robusto de errores:

- **Correo duplicado (P2002)**: `ConflictException` con mensaje descriptivo
- **Usuario no encontrado**: `NotFoundException` con ID específico
- **Datos inválidos**: `BadRequestException` con detalles del error
- **Validación automática**: class-validator rechaza datos que no cumplen con el esquema

## Estructura de Archivos

```
src/modules/summary-all-to-users/
├── dto/
│   ├── create-summary-all-to-user.dto.ts
│   └── update-summary-all-to-user.dto.ts
├── summary-all-to-users.controller.ts
├── summary-all-to-users.service.ts
└── summary-all-to-users.module.ts
```

## Ejemplo de Uso con cURL

### Crear usuario

```bash
curl -X POST http://localhost:3000/summary-all-to-users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María",
    "apellido": "González",
    "correo": "maria.gonzalez@email.com",
    "edad": 30,
    "comidaFavorita": "Tacos",
    "genero": "FEMENINO"
  }'
```

### Obtener todos los usuarios

```bash
curl http://localhost:3000/summary-all-to-users
```

### Obtener usuario por ID

```bash
curl http://localhost:3000/summary-all-to-users/1
```

### Actualizar usuario

```bash
curl -X PATCH http://localhost:3000/summary-all-to-users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "edad": 31,
    "comidaFavorita": "Sushi"
  }'
```

### Eliminar usuario

```bash
curl -X DELETE http://localhost:3000/summary-all-to-users/1
```

## Tecnologías Utilizadas

- **NestJS**: Framework backend
- **Prisma ORM**: Manejo de base de datos
- **PostgreSQL**: Base de datos
- **class-validator**: Validación de DTOs
- **class-transformer**: Transformación de datos
- **Swagger**: Documentación de API (decoradores incluidos)

## Notas Importantes

1. **Migración Pendiente**: Los errores de TypeScript que veas en el servicio se resolverán cuando ejecutes la migración con PostgreSQL activo.

2. **Validación Única de Correo**: La base de datos y la aplicación validan que el correo sea único.

3. **Swagger Docs**: Los decoradores de Swagger están incluidos. Accede a la documentación en `http://localhost:3000/api` cuando el servidor esté corriendo.

4. **Auto-generación de IDs**: Los IDs se generan automáticamente como enteros autoincrementales.
