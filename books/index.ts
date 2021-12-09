import "reflect-metadata";
import express from 'express';
import http from 'http';
import {Socket} from 'socket.io';
import indexRouter from './routes/index.js';
import booksApiRouter from './routes/api/books.js';
import userRouter from './routes/user.js';
import booksRouter from './routes/books.js';
import errorRouter from './routes/error.js';
import userApiRouter from './routes/api/user.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {sessionDeclare, sessionMiddleware} from './middleware/session.js';
import mongoose from 'mongoose';
// const store = require('./models/store');
import errorMiddleware from './middleware/error.js';
// const {passport} = require('./middleware/passport');
// const booksRepository = require('./models/booksRepository');
// booksRepository.getBooks().then((res) => console.log('RES: getBooks()', res));
// booksRepository.getBook().then((res) => console.log('RES: getBook()', res));

import path from 'path';
const __dirname = path.resolve();

const app = express();
import {createServer} from './models/socket.js';
const {server, io} = createServer(app);

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(sessionDeclare);
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(passport.initialize());
// app.use(passport.session());

app.use('/api/user', userApiRouter)
    .use('/api/books', booksApiRouter)
    .use('/user', userRouter)
    .use('/books', booksRouter)
    .use('/public', express.static(__dirname + '/public'))
    .use('/err', errorRouter)
    .use('/', indexRouter)
    .use(errorMiddleware)
    .use(express.json())

app.set('port', (process.env.PORT || 29999));
run();

async function run() {
    try {
        const host = `mongodb://${process.env.DB_HOST || 'mongo'}:${process.env.DB_PORT || 27017}`;
        const options = {
            user: process.env.DB_USER || 'root',
            pass: process.env.DB_PASS || '1234',
            dbName: process.env.DB_NAME || 'db',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        await mongoose.connect(host, options);

        // store.generateTestBooks(10);

        return server.listen(app.get('port'), function () {
            console.log(`Server is litening on port ${app.get('port')}`);
        });
    } catch (error) {
        console.error('Connection DB error...', error);
        process.exit(1);
    }
}
