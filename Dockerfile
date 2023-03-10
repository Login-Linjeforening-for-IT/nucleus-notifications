# Dockerfile
FROM node:14-alpine

WORKDIR /app
COPY package*.json ./

RUN npm install
RUN npm install node-cron
RUN npm install node-fetch
RUN npm install fs

COPY . .

CMD ["node", "index.mjs"]