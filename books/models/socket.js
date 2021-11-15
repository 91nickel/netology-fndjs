const http = require('http');
const socketIO = require('socket.io');
const store = require('../models/store');

let server, io;

function createServer(app) {
    console.log('createServer()');
    server = http.Server(app);
    io = socketIO(server);
    return {server, io};
}

function createBookViewIO() {
    console.log('createBookViewIO()', typeof io);
    if (typeof io === 'undefined') return null;

    io.on('connection', function (socket) {
        const {id} = socket;
        console.log(`Socket connected on: ${id}`);
        
        const {roomName} = socket.handshake.query;
        console.log(`Socket roomName: ${roomName}`);
        socket.join(roomName);
        socket.on('message-to-room', async function (message) {
            console.log('message-to-room', message);
            message.type = `room: ${roomName}`;
            const book = await store.select(roomName);
            console.log(book);
            if (book) {
                let comments = [];
                if (book.comments && book.comments.length > 0) {
                    comments = [...book.comments];
                }
                comments.push({user: message.user, text: message.text});
                await store.update(roomName, {comments: comments})
                message.type = `room: ${roomName}`;
                socket.to(roomName).emit('message-to-room', message);
                socket.emit('message-to-room', message);
            }
        });

        socket.on('disconnect', function (socket) {
            console.log(`Socket disconnected: ${id}`);
        })
    })

    return io;
}

module.exports = {createServer, createBookViewIO, server, io}