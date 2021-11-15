document.addEventListener('DOMContentLoaded', function () {
    console.log('footer.js connected');
    const room = window.location.pathname.split('/').pop();
    const socket = io.connect('/', {query: `roomName=${room}`});

    const commentsForm = document.querySelector('form#comment');
    const userField = commentsForm.querySelector('input[name=user]');
    const textField = commentsForm.querySelector('textarea[name=comment]');
    const chatContainer = document.querySelector('#chat');

    commentsForm.addEventListener('submit', function (event) {
        console.log('commentForm->submit()');
        event.preventDefault();
        socket.emit('message-to-room', {
            user: userField.value,
            text: textField.value,
        });
    })

    socket.on('message-to-room', function (message) {
        console.log('message-to-room', message);
        createComment(...Object.values(message));
        textField.value = "";
    })

    function createComment(user, message) {
        const html = document.createElement('div');
        chatContainer.appendChild(html);
        html.outerHTML = `<div class="row mt-4"><div class="col-12"><b>${user}</b></div><div class="col-12"><i>${message}</i></div></div>`
    }
})