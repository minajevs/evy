# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=19.8.1
FROM node:${NODE_VERSION}-slim as base

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1


# Throw-away build stage to reduce size of final image
FROM base as build

# Build variables
ARG NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID
ARG NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH

ENV NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID ${NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID}
ENV NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH ${NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3

# Install node modules
COPY --link .npmrc package-lock.json package.json ./
COPY --link apps/nextjs/package.json ./apps/nextjs/
COPY --link packages/db/package.json ./packages/db/
RUN npm ci --include=dev

# Copy application code
COPY --link . .

# Build application
# Since we’re not pulling the server environment variables into our container, 
# the environment schema validation will fail. To prevent this, we have to add a SKIP_ENV_VALIDATION=1
# flag to the build command so that the env-schemas aren’t validated at build time.
RUN SKIP_ENV_VALIDATION=1 npm run build

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM base

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /app/apps/nextjs/next.config.mjs ./
COPY --from=build /app/apps/nextjs/public ./public
COPY --from=build /app/apps/nextjs/package.json ./package.json

COPY --from=build --chown=nextjs:nodejs /app/apps/nextjs/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/nextjs/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "apps/nextjs/server.js"]
