FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# VITE_API_URL is baked in at build time.
# When using nginx as a reverse proxy (via docker-compose),
# the frontend calls /api/* which nginx forwards to the backend container.
# So VITE_API_URL should be empty string (relative URL) for containerised builds.
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# --- Production stage ---
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist /app/dist

EXPOSE 5173

CMD ["sh", "-c", "serve -s dist -l ${PORT:-5173}"]
