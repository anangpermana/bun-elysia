FROM oven/bun:1.2-alpine AS build
WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock
RUN bun install --frozen-lockfile

COPY drizzle.config.ts drizzle.config.ts
COPY ./src ./src

ENV NODE_ENV=production

FROM oven/bun:1.2-alpine
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts

ENV NODE_ENV=production

EXPOSE 3000

CMD ["bun", "run", "src/server.ts"]