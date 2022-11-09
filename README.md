# Установка
1. Загрузить ветку hotels репозитория  
```bash
    git clone -b hotels https://github.com/91nickel/netology-books.git netology-hotels
```

2. Заполнить файл .env переменными окружения
3. В docker-compose.yml в сервисе node пробросить нужные порты, или использовать 29999 если устраивает
4. Установить зависимости  
```bash
    docker-compose run --rm node npm i
```
5. Запустить  
```bash
    docker-compose up -d
```

## Вариант без установки
Задание опубликовано по адресу http://test2.foroffice.ru  
Туда можно отправлять тестовые запросы

Запросы для Postman, которые я использовал для тестирования, я собрал здесь:  
https://github.com/91nickel/netology-books/blob/hotels/hotels.postman_collection.json  

По адресу http://test2.foroffice.ru откроется страница, на которой можно подписаться на получение сообщений по support request id через WebSocket  
