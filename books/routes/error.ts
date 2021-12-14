import express from 'express';
const router = express.Router();

router.get('/', function (request: any, response: any) {
    throw new Error('This is test error');
})

export default router;

