# ---- Dependencies ----
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM nginx:1.24-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
