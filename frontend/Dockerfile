# Stage 1: Build the React app using Vite
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json or yarn.lock
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the Vite app for production
RUN npm run build

# Stage 2: Serve the React app using Nginx
FROM nginx:alpine AS production

# Copy the built app from the previous stage to the Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
