const express = require('express');
const fs = require('fs');
const path = require('path');

//if (!fs.existsSync(path.join(__dirname, 'counter'))) {
fs.writeFileSync(path.join(__dirname, 'counter'), '{}');
//}

const app = express();

app.get('/counter/:id', async function (request, response) {
    const counts = await readCounts();
    const count = typeof counts[request.params.id] === 'undefined' ? 0 : +counts[request.params.id];
    response.send(String(count))
});

app.post('/counter/:id/incr', async function (request, response) {
    response.send(JSON.stringify(await incrementCount(request.params.id)));
});

app.get('/', function (request, response) {
    response.status(404);
    response.send('404 | Not Found')
})

async function incrementCount(id) {
    console.log('incrementCount()', id);
    let counts = await readCounts();
    console.log(counts);
    counts[id] = typeof counts[id] === 'undefined' ? 1 : +counts[id] + 1;
    console.log('newCounts', counts);
    return await writeCounts(counts);
}

function readCounts() {
    console.log('readCounts()');
    return new Promise(function (resolve, reject) {
        const readerStream = fs.createReadStream(path.join(__dirname, 'counter'));
        readerStream.setEncoding('UTF8');
        let data = '';
        readerStream.on('data', (chunk) => {
            data += chunk
        });
        readerStream.on('end', function () {
            resolve(JSON.parse(data));
        });
        readerStream.on('error', function (err) {
            console.error(err);
            reject({'error': 'undefined error'});
        });
    });
}

function writeCounts(data) {
    console.log('writeCounts()', data);
    return new Promise(function (resolve, reject) {
        const writerStream = fs.createWriteStream(path.join(__dirname, 'counter'));
        writerStream.write(JSON.stringify(data));
        writerStream.end();
        writerStream.on('finish', function () {
            resolve(data);
        });
        writerStream.on('error', function (err) {
            console.error(err);
            reject({'error': 'undefined error'});
        });
    });
}

app.set('port', (process.env.PORT || 80));

app.listen(app.get('port'), function () {
    console.log(`Server is litening on port ${app.get('port')}`);
});