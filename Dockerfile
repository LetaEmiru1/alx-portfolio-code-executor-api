# --- Stage 1: Build Stage ---
# Use an official Node.js image as a parent image.
# The 'as builder' gives this stage a name we can refer to later.
FROM node:18-slim as builder

# Set the working directory inside the container.
WORKDIR /app

# Copy the package.json and package-lock.json files.
COPY package*.json ./

# Install production dependencies. The --only=production flag skips devDependencies like nodemon.
RUN npm install --only=production

# Copy the rest of your application's source code.
COPY . .

# --- Stage 2: Production Stage ---
# Start from a clean, small Node.js image for the final image. This keeps it lightweight.
FROM node:18-slim

WORKDIR /app

# Copy the installed node_modules from the 'builder' stage.
# This is a key optimization. It keeps our final image small and clean.
COPY --from=builder /app/node_modules ./node_modules

# Copy the application source code from the 'builder' stage.
COPY --from=builder /app ./

# Expose the port the app runs on.
# This tells Docker that the container will listen on port 5000.
EXPOSE 5000

# Define the command to run your app.
# This is the command that will be executed when the container starts.
CMD [ "node", "app.js" ]
