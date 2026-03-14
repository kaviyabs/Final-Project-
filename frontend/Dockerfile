FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# We build the production dist
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist /app/dist

# Expose port (default 5173 matching Vite, or dynamic PORT for Render/Railway)
EXPOSE 5173

# Run the serve application
CMD ["sh", "-c", "serve -s dist -l ${PORT:-5173}"]
