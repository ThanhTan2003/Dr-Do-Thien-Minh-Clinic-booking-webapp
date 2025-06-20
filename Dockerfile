# Stage 1: Build the Angular application
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application with environment variables
ARG API_BASE_URL
RUN sed -i "s|http://localhost:8180|${API_BASE_URL}|g" src/app/environments/environment.prod.ts
RUN npm run build -- --configuration production

# Stage 2: Serve the application
FROM nginx:alpine

# Copy the built application from the build stage
COPY --from=build /app/dist/dr-do-thien-minh-clinic-booking-webapp/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 