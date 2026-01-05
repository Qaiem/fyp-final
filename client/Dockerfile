# Step 1: Build the React App
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# --- REQUIRED FIX START ---
# Accept the URL from the GitHub Action
ARG VITE_API_URL
# Make it available to the React build process
ENV VITE_API_URL=$VITE_API_URL
# --- REQUIRED FIX END ---

RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# NOTE: If you are using Create-React-App instead of Vite, change '/app/dist' to '/app/build'
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]