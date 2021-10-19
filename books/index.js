const express = require('express');
const indexRouter = require('./routes/index.js');
const booksApiRouter = require('./routes/api/books.js');
const booksRouter = require('./routes/books.js');
const errorRouter = require('./routes/error.js');
const userApiRouter = require('./routes/api/user.js');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const store = require('./models/store');
const errorMiddleware = require('./middleware/error');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/user', userApiRouter)
    .use('/api/books', booksApiRouter)
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

        return app.listen(app.get('port'), function () {
            console.log(`Server is litening on port ${app.get('port')}`);
        });
    } catch (error) {
        console.error('Connection DB error...', error);
        process.exit(1);
    }
}
