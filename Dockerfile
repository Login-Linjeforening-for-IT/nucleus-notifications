# Uses latest node alpine image
FROM node:23.11.1-alpine

# Sets the working directory
WORKDIR /usr/src/app

# Copies package.json and package-lock.json to the Docker environment
COPY package.json package-lock.json ./

RUN ping vg.no

RUN wget vg.no

RUN ping google.com

RUN wget google.com

# Installs required dependencies
RUN npm ci || (echo "==== DEBUG LOG ====" && cat /root/.npm/_logs/*-debug-0.log && exit 1)

# Copies contents
COPY . .

# Starts the application
CMD npm start
