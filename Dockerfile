# syntax = docker/dockerfile:1

ARG BUN_VERSION=1.3.2
FROM oven/bun:${BUN_VERSION}-slim AS base

LABEL fly_launch_runtime="Bun"

WORKDIR /app

ENV NODE_ENV="production"

# Build stage
FROM base AS build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential pkg-config python-is-python3

COPY bun.lock package.json ./
RUN bun install --ci

COPY . .

# Final stage
FROM base

COPY --from=build /app /app

EXPOSE 3000

CMD [ "bun", "run", "index.js" ]
