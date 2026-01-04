FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# CHANGE THIS TO 8800
EXPOSE 8800 

CMD ["npm", "start"]