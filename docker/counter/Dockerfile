FROM node:14.17.6

RUN git clone https://github.com/91nickel/netology-books-counter.git && mv /netology-books-counter /www && chown -R www-data: /www

WORKDIR /www

RUN npm install