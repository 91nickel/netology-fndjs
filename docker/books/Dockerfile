FROM node:14.17.6

RUN npm install -g nodemon pm2
RUN git clone https://github.com/91nickel/netology-books.git && mv /netology-books /www && chown -R www-data: /www

WORKDIR /www

RUN npm install