FROM node:20-alpine AS build

# 1. Accept the build argument from GitHub Actions
ARG VITE_APP_BASE_URL

# 2. Set it as an environment variable so Vite can see it during 'npm run build'
ENV VITE_APP_BASE_URL=$VITE_APP_BASE_URL

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Now when this runs, Vite will bake the AWS IP into the JavaScript code
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]