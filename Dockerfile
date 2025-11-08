# ========== deps ==========
# Instalamos deps SIN correr postinstall (evitamos que "prisma generate" se ejecute
# antes de que exista la carpeta prisma/schema.prisma).
FROM node:22-alpine AS deps
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --ignore-scripts

# ========== build (TS -> JS) ==========
FROM node:22-alpine AS build
WORKDIR /app
# Copiamos código completo del backend
COPY backend ./
# Traemos node_modules del stage deps
COPY --from=deps /app/node_modules ./node_modules
# Compilamos TS -> JS y ahora sí generamos Prisma Client
RUN npm run build && npx prisma generate

# ========== runtime ==========
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Prisma en Alpine requiere OpenSSL en runtime
RUN apk add --no-cache openssl

# Copiamos node_modules (CLI de prisma y @prisma/client ya están)
COPY --from=deps /app/node_modules ./node_modules
# Copiamos el build compilado
COPY --from=build /app/dist ./dist
# Copiamos carpeta prisma (schema y migrations si las tienes)
COPY backend/prisma ./prisma

EXPOSE 3000
# Aplicamos migraciones y arrancamos Nest
CMD ["sh", "-lc", "npx prisma migrate deploy && node dist/main.js"]
