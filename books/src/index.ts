import express from 'express';
import http from 'http';
import {Socket} from 'socket.io';
import indexRouter from './routes';
import booksApiRouter from './routes/api/books';
import userRouter from './routes/user';
import booksRouter from './routes/books';
import errorRouter from './routes/error';
import userApiRouter from './routes/api/user';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {sessionDeclare, sessionMiddleware} from './middleware/session';
import mongoose from 'mongoose';
// const store = require('./models/store');
import errorMiddleware from './middleware/error';

// const {passport} = require('./middleware/passport');
// const booksRepository = require('./models/booksRepository');
// booksRepository.getBooks().then((res) => console.log('RES: getBooks()', res));
// booksRepository.getBook().then((res) => console.log('RES: getBook()', res));

const app = express();
import {createServer} from './models/socket';
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
