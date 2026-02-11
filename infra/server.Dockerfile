FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY server/package*.json ./
RUN npm install

# Copy source and build
COPY server/ ./
RUN npm run build

FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copy built server (and package.json for scripts)
COPY --from=build /app ./

# Default to a single worker; other env (DATABASE, CONFIG_PATH, PORT)
# are provided via docker-compose.yml for flexibility.
ENV THREADS=1

EXPOSE 3001 3002 3003

CMD ["npm", "run", "start"]

