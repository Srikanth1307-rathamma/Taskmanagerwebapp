# Stage 1: Build the React application
FROM node:20-alpine AS stage1
WORKDIR /Srikanth
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the production static files via Nginx
FROM nginx:1.25-alpine
COPY --from=stage1 /Srikanth/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
