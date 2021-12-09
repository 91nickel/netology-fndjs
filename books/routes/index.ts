import express from 'express';
const router = express.Router();

router.get('/', function (request, response) {
    return response.render('index', {title: 'Welcome'});
})

export default router;