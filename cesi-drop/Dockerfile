# Multi-stage Dockerfile optimisé ARM64 (Raspberry Pi 4) et AMD64

# Stage 1: Builder (compilation assets Vite + modules natifs)
FROM node:24-bookworm-slim AS builder

WORKDIR /app

# Outils de compilation nécessaires pour better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Élagage des dépendances de développement
RUN npm prune --omit=dev

# Stage 2: Runtime production allégé
FROM node:24-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3333 \
    HOST=0.0.0.0

# Copie des dépendances de production précompilées
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY app ./app
COPY bin ./bin
COPY config ./config
COPY database ./database
COPY resources ./resources
COPY start ./start
COPY ace.js adonisrc.js package.json ./

# Dossiers d'accueil pour volumes montés
RUN mkdir -p uploads tmp

EXPOSE 3333

# Limite mémoire 512M adaptée à la RAM RPi 4
CMD ["node", "--max-old-space-size=512", "bin/server.js"]
