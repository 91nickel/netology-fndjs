FROM node:14.17.6

RUN git clone https://github.com/91nickel/netology-books.git && mv /netology-books/counter /www && chown -R www-data: /www && rm -dr /netology-books

WORKDIR /www

RUN npm install