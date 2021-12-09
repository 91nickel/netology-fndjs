import fs from 'fs';
import path from 'path';
import express from 'express';
import fileMiddleware from '../../middleware/upload_file.js';
import store from '../../models/store.js';
const router = express.Router();

router.get('/:id/download', function (request, response) {
    const book = store.select(request.params.id);
    if (book) {
        const filepath = path.join(__dirname, '../public/img/', book.fileCover);
        if (book.fileCover && fs.existsSync(filepath)) {
            return response.download(filepath, 'file_cover.png', function (err) {
                if (err) {
                    console.error(err)
                    return response.status(404).json({result: 'error', message: 'Error 404 Not Found'})
                }
            });
        }
    }
    return response.status(404).json({result: 'error', message: 'Error 404 Not Found'})
})

router.get('/:id', async function (request, response) {
    const book = await store.select(request.params.id);
    if (book)
        return response.json({result: book})
    else
        return response.status(404).json({result: 'error', message: 'Error 404 Not Found'})
})

router.get('/', async function (request, response) {
    return response.json({result: await store.select()});
})

router.post('/', async function (request, response) {
    return response.json({result: await store.add(request.body)})
})

router.put('/:id/upload',
    fileMiddleware.single('image'),
    function (request, response) {
        console.log(request.file)
        if (typeof request.file === 'undefined') {
            return response.status(500).json({
                result: 'error',
                message: 'Error 500 Required field image is empty or has unavailable format'
            })
        }
        const book = store.update(request.params.id, {fileCover: request.file.filename});
        if (book) {
            return response.json({result: book})
        }
        return response.status(404).json({result: 'error', message: 'Error 404 Not Found'})
    })

router.put('/:id', async function (request, response) {
    const book = await store.update(request.params.id, request.body);
    if (book)
        return response.json({result: book})
    else
        return response.status(404).json({result: 'error', message: 'Error 404 Not Found'})
})


router.delete('/:id', async function (request, response) {
    const result = await store.delete(request.params.id);
    if (result)
        return response.json({result: 'OK'})
    else
        return response.status(404).json({result: 'false', message: 'Error 404 Not Found'})
})

export default router;

