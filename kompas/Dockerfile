# Multi-stage Dockerfile optimisé ARM64 (Raspberry Pi 4) et AMD64

# Stage 1: Builder (Next.js standalone)
FROM node:24-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_SUPABASE_URL=""
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=""
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
ARG NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=""
ARG NEXT_PUBLIC_POSTHOG_HOST=""

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY \
    NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=$NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN \
    NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 2: Runtime Next.js standalone léger
FROM node:24-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3334 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN mkdir -p .data

EXPOSE 3334

# Limite mémoire 512M adaptée à la RAM RPi 4
CMD ["node", "--max-old-space-size=512", "server.js"]
