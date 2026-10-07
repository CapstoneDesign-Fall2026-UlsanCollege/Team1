FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
RUN npm ci --prefix backend && npm ci --prefix frontend
COPY backend ./backend
COPY frontend ./frontend
RUN npm run build --prefix backend
RUN VITE_BASE_PATH=/ VITE_API_ORIGIN= npm run build --prefix frontend

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV SERVE_FRONTEND=true
COPY backend/package*.json ./backend/
RUN npm ci --omit=dev --prefix backend
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/frontend/dist ./frontend/dist
WORKDIR /app/backend
CMD ["node", "dist/server.js"]
