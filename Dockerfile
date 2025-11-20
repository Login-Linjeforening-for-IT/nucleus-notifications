# Uses latest node alpine image
FROM node:alpine

# Sets the working directory
WORKDIR /usr/src/app

# Copies package.json and package-lock.json to the Docker environment
COPY package.json package-lock.json ./

# Installs required dependencies
RUN npm ci --omit=dev

# Copies contents
COPY . .

# Starts the application
CMD npm start
