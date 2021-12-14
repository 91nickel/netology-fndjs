import fs from 'fs';
import path from 'path';
import express from 'express';
import fileMiddleware from '../../middleware/upload_file';
// import store from '../../models/store';
import {Book} from "../../models/book";

const router = express.Router();
import {container} from "../../models/container";
import {BooksRepository} from "../../models/booksRepository";

const repository: BooksRepository = container.get(BooksRepository);

router.get('/:id/download', async function (request: any, response: any) {
    // const book = store.select(request.params.id);
    const book: Book | void = await repository.getBook(request.params.id);
    if (book) {
        const filepath = path.join(__dirname, '../public/img/', book.fileCover);
        if (book.fileCover && fs.existsSync(filepath)) {
            return response.download(filepath, 'file_cover.png', function (err: any) {
                if (err) {
                    console.error(err)
                    return response.status(404).json({result: 'error', message: 'Error 404 Not Found'})
                }
            });
        }
    }
    return response.status(404).json({result: 'error', message: 'Error 404 Not Found'})
})

router.get('/:id', async function (request: any, response: any) {
    // const book = await store.select(request.params.id);
    const book: Book | void = await repository.getBook(request.params.id);

    if (book)
        return response.json({result: book})
    else
        return response.status(404).json({result: 'error', message: 'Error 404 Not Found'})
})

router.get('/', async function (request: any, response: any) {
    // return response.json({result: await store.select()});
    return response.json({result: await repository.getBooks()});
})

router.post('/', async function (request: any, response: any) {
    // return response.json({result: await store.add(request.body)})
    return response.json({result: await repository.createBook(request.body)})
})

router.put('/:id/upload',
    fileMiddleware.single('image'),
    async function (request: any, response: any) {
        console.log(request.file)
        if (typeof request.file === 'undefined') {
            return response.status(500).json({
                result: 'error',
                message: 'Error 500 Required field image is empty or has unavailable format'
            })
        }
        // const book = store.update(request.params.id, {fileCover: request.file.filename});
        const book: Book | void = await repository.getBook(request.params.id);

        if (book) {
            return response.json({result: book})
        }
        return response.status(404).json({result: 'error', message: 'Error 404 Not Found'})
    })

router.put('/:id', async function (request: any, response: any) {
    const book: Book | void = await repository.getBook(request.params.id);
        // const book = await store.update(request.params.id, request.body);
        if(book) {
        await book.update(request.body).save();
        return response.json({result: book})
    }
    return response.status(404).json({result: 'error', message: 'Error 404 Not Found'})
})


router.delete('/:id', async function (request: any, response: any) {
    const book: Book | void = await repository.deleteBook(request.params.id);
    // const result = await store.delete(request.params.id);
    if (book)
        return response.json({result: 'OK'})
    else
        return response.status(404).json({result: 'false', message: 'Error 404 Not Found'})
})

export default router;

