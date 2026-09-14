FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY common/package*.json ./common/
COPY worker/package*.json ./worker/

RUN npm install

COPY common/ ./common/
COPY worker/ ./worker/

RUN npm run build -w @brisq/common

WORKDIR /app/worker

CMD ["npm", "run", "dev"]