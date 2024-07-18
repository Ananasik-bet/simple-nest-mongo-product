FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

COPY prisma/schema.prisma /usr/src/app/prisma/schema.prisma

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Copy the entire application to the working directory
COPY . .

ARG PORT=3000
ENV PORT=${PORT}

# Expose the port the app runs on
EXPOSE $PORT

# Running as root user, no need to switch user
RUN chmod +x entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

# Start the application
CMD ["npm", "run", "start"]