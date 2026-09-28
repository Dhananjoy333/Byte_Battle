# ==========================================
# 1. Base image
# ==========================================
FROM node:20-alpine AS base

# Install libc6-compat if needed for Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ==========================================
# 2. Dependencies installation
# ==========================================
FROM base AS deps
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Clean install dependencies
RUN npm ci

# ==========================================
# 3. Build the application
# ==========================================
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build arguments for public environment variables
ARG NEXT_PUBLIC_IMAGEKIT_URL=https://ik.imagekit.io/oq0eiylwn/Byte_Battle
ENV NEXT_PUBLIC_IMAGEKIT_URL=${NEXT_PUBLIC_IMAGEKIT_URL}

# Build Next.js application (standalone output configured in next.config.ts)
RUN npm run build

# ==========================================
# 4. Production Runner
# ==========================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and public directory
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set correct permissions for prerender cache
RUN mkdir .next && chown nextjs:nodejs .next

# Copy standalone build output and static bundle
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
