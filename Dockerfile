# Use an official Node.js runtime as a parent image
FROM ubuntu:22.04

RUN apt-get update && apt-get install curl -y
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash - &&\
apt-get install -y nodejs
# Set the working directory to /app
WORKDIR /app

# Define environment variables
ARG DB_HOST
ARG DB_PORT
ARG DB_NAME
ARG DB_USERNAME
ARG DB_PASSWORD

# Copy the .env.template file
COPY .env.example .env

# Define the command to run the server
RUN sed -i "s|johndoe|${DB_USERNAME}|" .env && \
    sed -i "s|randompassword|${DB_PASSWORD}|" .env && \
    sed -i "s|localhost|${DB_HOST}|" .env && \
    sed -i "s|3306|${DB_PORT}|" .env && \
    sed -i "s|pepper|${DB_NAME}|" .env

# Install dependencies
COPY package*.json tsconfig.json ./
RUN npm install
#RUN npm install prisma --save-dev

# Copy the rest of the application files
COPY . .

# Make port available to the world outside this container
ENV PORT=5000
ENV REDIS_URL=redis://redis:6379
EXPOSE $PORT

CMD npx prisma migrate deploy --schema ./src/prisma/schema.prisma && npx prisma generate --schema=./src/prisma/schema.prisma && npm run build &&  npm run start
