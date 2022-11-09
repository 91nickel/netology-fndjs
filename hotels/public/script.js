document.addEventListener('DOMContentLoaded', function () {
    console.log('Hello World');

    const socket = io()

    socket.on('connect', function () {
        console.log('connect...', socket)

        const form = document.querySelector('form#subscribe')
        form.addEventListener('submit', function (event) {
            event.preventDefault()
            const chatId = form.querySelector('input[name=support-request-id]').value
            if (chatId) {
                console.log('Try to subscribe for', chatId)
                // 63697f3de3965b91761cd6fe
                socket.emit('subscribeToChat', {chatId: chatId})
            } else {
                throw new Error('Empty support request id')
            }
        })

        socket.on("message", (message) => {
            console.log('message', message)
            form.querySelector('textarea').value = message.text
        });
    })

    socket.on('connection', function (socket) {
        console.log('connection...', socket)
    })

    // socket.on('connect', socket => {
    //     console.log('Connected...', socket)
    //     socket.send('subscribeToChat', {chatId: 'qwerty'})
    //     socket.on('message', msg => console.log(msg))
    // })

    // const chatContainer = document.querySelector('#chat');
    // const commentsForm = document.querySelector('form#comment');
    // const userField = commentsForm.querySelector('input[name=user]');
    // const textField = commentsForm.querySelector('textarea[name=comment]');
    //

    // const socket = new WebSocket('ws://158.160.11.162:8080', null);

    // socket.onopen = function () {
    //     console.log('Connected');
    // const bookId = window.location.pathname.split('/').pop();
    // const message = {event: 'getAllComments', data: bookId};
    // console.log(message);
    //
    // socket.send(JSON.stringify(message));
    //
    // commentsForm.addEventListener('submit', function (event) {
    //     console.log('commentForm->submit()');
    //     event.preventDefault();
    //     const message = {event: 'addComment', data: {bookId: bookId, comment: textField.value}}
    //     socket.send(JSON.stringify(message));
    // })
    //
    // socket.onmessage = function (data) {
    //     console.log(data);
    // };
    // };
})