# Dockerfile
FROM node:14-alpine

RUN npm install node-cron node-fetch fs

COPY . .

CMD npm start
