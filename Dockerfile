FROM node:22

WORKDIR /app
RUN npm install -g pnpm

CMD "tail" "-f" "/dev/null"
