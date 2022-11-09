FROM node:14.17.6

RUN npm install -g @nestjs/cli

COPY ./entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r//' /entrypoint.sh && chmod +x /entrypoint.sh
