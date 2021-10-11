const express = require('express');
const indexRouter = require('./routes/index.js');
const booksApiRouter = require('./routes/api/books.js');
const booksRouter = require('./routes/books.js');
const errorRouter = require('./routes/error.js');
const userApiRouter = require('./routes/api/user.js');
const bodyParser = require('body-parser');
const errorMiddleware = require('./middleware/error');
const store = require('./models/store');

store.generateTestBooks(10);

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

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function () {
    console.log(`Server is litening on port ${app.get('port')}`);
});