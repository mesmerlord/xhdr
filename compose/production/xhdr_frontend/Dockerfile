FROM node:23-slim AS base

# Set necessary environment for Debian front-end non-interactive mode
ARG DEBIAN_FRONTEND=noninteractive

# Install necessary dependencies for the build process
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

FROM base AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the project
ARG NEXT_PUBLIC_CURRENT_SITE
RUN echo "NEXT_PUBLIC_CURRENT_SITE=$NEXT_PUBLIC_CURRENT_SITE" >> .env
RUN npm run build

FROM base AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    wget curl imagemagick \
    && rm -rf /var/lib/apt/lists/*

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for the app directory
RUN mkdir .next
RUN chown -R nextjs:nodejs /app

USER nextjs

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
# Copy ICC profile for HDR image processing
COPY --from=builder --chown=nextjs:nodejs /app/2020_profile.icc ./2020_profile.icc

EXPOSE 3000
ENV PORT 3000
ENV NODE_ENV production

CMD ["node", "server.js"]
