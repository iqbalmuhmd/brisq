FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY common/package*.json ./common/
COPY auth/package*.json ./auth/

RUN npm install

COPY common/ ./common/
COPY auth/ ./auth/

RUN npm run build -w @brisq/common

WORKDIR /app/auth

EXPOSE 3001

CMD ["npm", "run", "dev"]