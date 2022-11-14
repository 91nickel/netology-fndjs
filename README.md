# Установка
1. Загрузить ветку hotels репозитория  
```bash
    git clone -b hotels https://github.com/91nickel/netology-books.git netology-hotels
    
    cd netology-hotels
    
    mv .env-example .env
```

2. Заполнить файл .env переменными окружения
3. В docker-compose.yml в сервисе node пробросить нужные порты, или использовать 29999 если устраивает
```yml
ports:
  - 29999:29999
  - 8080:8080
```
4. Запустить  
```bash
    docker-compose up -d
```

## Вариант без установки
Задание опубликовано по адресу http://test2.foroffice.ru  
Туда можно отправлять тестовые запросы

Запросы для Postman, которые я использовал для тестирования, я собрал здесь:  
https://github.com/91nickel/netology-books/blob/hotels/hotels.postman_collection.json  
Там уже создано три тестовых пользователя с почтой/паролем:  
  
client@mail.ru / 123456  
manager@mail.ru / 123456  
admin@mail.ru / 123456  
  
По адресу http://test2.foroffice.ru/api откроется страница, на которой можно подписаться на получение сообщений по support request id через WebSocket  
