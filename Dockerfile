# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app


# Copy the .env.template file
COPY .env.example .env

# Define the command to run the server
RUN sed -i "s|johndoe|${DB_USERNAME}|" .env && \
    sed -i "s|randompassword|${DB_PASSWORD}|" .env && \
    sed -i "s|localhost|${DB_HOST}|" .env && \
    sed -i "s|3306|${DB_PORT}|" .env && \
    sed -i "s|pepper|${DB_NAME}|" .env

# Install dependencies
COPY package*.json ./
RUN npm install


# Copy the rest of the application files
COPY src .

# Build the Prisma client
RUN npx prisma generate

# Push migration to DB
RUN npx prisma migrate deploy

# Seed db with necessary data
RUN npm run seed

# Build the prod code
RUN npm run build

# Make port available to the world outside this container
ENV PORT=5000
EXPOSE $PORT


# Define the command to run the server
CMD ["npm", "start"]
