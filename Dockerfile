# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=19.8.1
FROM node:${NODE_VERSION}-slim as base

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Build variables
ARG DATABASE_URL
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET

# Is it okay to expose those vars to env?
ENV DATABASE_URL ${DATABASE_URL}
ENV GITHUB_CLIENT_ID ${GITHUB_CLIENT_ID}
ENV GITHUB_CLIENT_SECRET ${GITHUB_CLIENT_SECRET}
ENV NEXTAUTH_URL ${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET ${NEXTAUTH_SECRET}

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
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "start" ]
