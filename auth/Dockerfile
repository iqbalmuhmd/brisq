FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY common/package*.json ./common/
COPY auth/package*.json ./auth/

RUN npm install

COPY common/ ./common/
COPY auth/ ./auth/

RUN npm run build -w @brisq/common

RUN npm run build -w auth

WORKDIR /app/auth

EXPOSE 3001

CMD ["node", "dist/index.js"]
