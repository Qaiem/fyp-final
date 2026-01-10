# Step 1: Build the React App
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# --- REQUIRED FIX START ---
# Accept the URL from the GitHub Action
ARG VITE_APP_BASE_URL
# Make it available to the React build process
ENV VITE_APP_BASE_URL=$VITE_APP_BASE_URL
# --- REQUIRED FIX END ---

RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

# ------------------------------------------------------
# ⚠️ CRITICAL MISSING LINE ⚠️
# This copies your custom config to replace the default one
COPY nginx.conf /etc/nginx/conf.d/default.conf
# ------------------------------------------------------
    
COPY --from=build /app/dist /usr/share/nginx/html
# NOTE: If you are using Create-React-App instead of Vite, change '/app/dist' to '/app/build'
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]