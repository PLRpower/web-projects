# Multi-stage Dockerfile optimisé ARM64 (Raspberry Pi 4) et AMD64

# Stage 1: Build front-end Vite
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Runtime production allégé
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3333 \
    HOST=0.0.0.0

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Fichiers compilés et sources serveur
COPY --from=builder /app/public ./public
COPY app ./app
COPY bin ./bin
COPY config ./config
COPY database ./database
COPY resources ./resources
COPY start ./start
COPY ace.js adonisrc.js ./

# Dossiers d'accueil pour volumes montés
RUN mkdir -p uploads tmp

EXPOSE 3333

# Limite mémoire 512M adaptée à la RAM RPi 4
CMD ["node", "--max-old-space-size=512", "bin/server.js"]
