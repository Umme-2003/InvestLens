# Dockerfile for the Frontend

# --- Stage 1: Build the React application ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the application for production
# This creates a highly optimized 'build' folder
RUN npm run build

# --- Stage 2: Serve the application using Nginx ---
# Nginx is a lightweight, high-performance web server
FROM nginx:stable-alpine

# Copy the optimized build output from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Nginx will automatically serve the index.html file from this directory
# We need to configure Nginx to handle client-side routing.
# We'll create the nginx.conf file next.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]