import http from 'http';
import { Server } from 'socket.io';
// import store from '../models/store';
import {container} from "./container";
import {BooksRepository} from "./booksRepository";
const repository: BooksRepository = container.get(BooksRepository);

let server: any, io: any;

export const createServer = function (app: any) {
    console.log('createServer()');
    server = new http.Server(app);
    io = new Server(server);
    return {server, io};
}

export const createBookViewIO = function () {
    console.log('createBookViewIO()', typeof io);
    if (typeof io === 'undefined') return null;

    io.on('connection', function (socket: any) {
        const {id} = socket;
        console.log(`Socket connected on: ${id}`);
        
        const {roomName} = socket.handshake.query;
        console.log(`Socket roomName: ${roomName}`);
        socket.join(roomName);
        socket.on('message-to-room', async function (message: any) {
            console.log('message-to-room', message);
            message.type = `room: ${roomName}`;
            // const book = await store.select(roomName);
            const book = await repository.getBook(roomName);
            console.log(book);
            if (book) {
                let comments: any[] = [];
                if (book.comments && book.comments.length > 0) {
                    comments = [...book.comments];
                }
                comments.push({user: message.user, text: message.text});
                // await store.update(roomName, {comments: comments})
                await repository.updateBook(roomName, {comments: comments})
                message.type = `room: ${roomName}`;
                socket.to(roomName).emit('message-to-room', message);
                socket.emit('message-to-room', message);
            }
        });

        socket.on('disconnect', function (socket: any) {
            console.log(`Socket disconnected: ${id}`);
        })
    })

    return io;
}

export default {createServer, createBookViewIO, server, io, Server}