const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const indexRouter = require('./routes/index.js');
const booksApiRouter = require('./routes/api/books.js');
const userRouter = require('./routes/user.js');
const booksRouter = require('./routes/books.js');
const errorRouter = require('./routes/error.js');
const userApiRouter = require('./routes/api/user.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {sessionDeclare, sessionMiddleware} = require('./middleware/session');
const mongoose = require('mongoose');
// const store = require('./models/store');
const errorMiddleware = require('./middleware/error');
// const {passport} = require('./middleware/passport');

const app = express();
const {server, io} = require('./models/socket').createServer(app);

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
