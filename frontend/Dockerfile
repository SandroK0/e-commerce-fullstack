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

# Stage 2: Serve the React app using Apache
FROM httpd:2.4
# Copy the built app from the previous stage to the Apache html directory
COPY --from=build /app/dist/ /usr/local/apache2/htdocs/
# Copy the .htaccess file to the same directory as index.html
COPY .htaccess /usr/local/apache2/htdocs/.htaccess

# Enable necessary Apache modules
RUN sed -i \
        -e 's/^#\(LoadModule rewrite_module modules\/mod_rewrite.so\)/\1/' \
        -e 's/^#\(LoadModule headers_module modules\/mod_headers.so\)/\1/' \
        -e 's/^#\(LoadModule expires_module modules\/mod_expires.so\)/\1/' \
        /usr/local/apache2/conf/httpd.conf

# Enable .htaccess files
RUN sed -i '/<Directory "\/usr\/local\/apache2\/htdocs">/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /usr/local/apache2/conf/httpd.conf

# Expose port 80
EXPOSE 80
# Start Apache (this is done automatically by the base image)