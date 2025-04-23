# Этап сборки
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN ls -la prisma
RUN npx prisma generate
RUN ls -la node_modules/@prisma/client
COPY . .
RUN npm run build

# Финальный этап
FROM node:20-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl postgresql-client && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
RUN npm install --production
RUN npx prisma generate
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]