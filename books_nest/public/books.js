document.addEventListener('DOMContentLoaded', function () {
    console.log('Hello World');

    const chatContainer = document.querySelector('#chat');
    const commentsForm = document.querySelector('form#comment');
    const userField = commentsForm.querySelector('input[name=user]');
    const textField = commentsForm.querySelector('textarea[name=comment]');

    const socket = new WebSocket('ws://test.foroffice.ru:8080');

    socket.onopen = function () {
        console.log('Connected');
        const bookId = window.location.pathname.split('/').pop();
        const message = {event: 'getAllComments', data: bookId};
        console.log(message);

        socket.send(JSON.stringify(message));

        commentsForm.addEventListener('submit', function (event) {
            console.log('commentForm->submit()');
            event.preventDefault();
            const message = {event: 'addComment', data: {bookId: bookId, comment: textField.value}}
            socket.send(JSON.stringify(message));
        })

        socket.onmessage = function (data) {
            console.log(data);
        };
    };
})