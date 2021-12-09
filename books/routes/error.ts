import express from 'express';
const router = express.Router();

router.get('/', function (request, response) {
    throw new Error('This is test error');
})

export default router;

