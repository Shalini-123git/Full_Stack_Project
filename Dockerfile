FROM ghcr.io/puppeteer/puppeteer:24.19.0

ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci || npm install
CMD ["node", "app.js"]