FROM node:22-alpine AS deps
WORKDIR /app
# Instalamos deps sin postinstall para evitar "prisma generate" antes de tiempo
COPY backend/package*.json ./
RUN npm ci --ignore-scripts

# ========== build (TS -> JS) ==========
FROM node:22-alpine AS build
WORKDIR /app
# Copiamos el código del backend
COPY backend ./
# Traemos node_modules del stage deps
COPY --from=deps /app/node_modules ./node_modules
# Solo compilamos TS -> JS (sin prisma generate)
RUN npm run build

# ========== runtime ==========
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Prisma en Alpine requiere OpenSSL
RUN apk add --no-cache openssl

# node_modules (incluye prisma CLI y @prisma/client como dependencia)
COPY --from=deps /app/node_modules ./node_modules
# Código compilado
COPY --from=build /app/dist ./dist
# Carpeta prisma (schema + migrations si las tienes)
COPY backend/prisma ./prisma

EXPOSE 3000

# Generamos Prisma Client con las variables REALES (Railway), migramos y arrancamos
CMD ["sh", "-lc", "npx prisma generate && npx prisma migrate deploy && node dist/main.js"]