# Use official Node.js LTS image
FROM node:24-slim

# Install necessary dependencies for Puppeteer
RUN apt-get update && \
    apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# RUN apt-get install -y \
#   fonts-noto \
#   fonts-noto-cjk \
#   fonts-noto-color-emoji

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json ./

# Install app dependencies
RUN npm i

# Copy app source code
COPY tests ./tests

# Expose port if your app listens on one (optional)
# EXPOSE 3000

# Run the app
ENTRYPOINT ["node", "./tests/index.js"]