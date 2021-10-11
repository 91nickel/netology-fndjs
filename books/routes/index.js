const express = require('express');
const router = express.Router();

router.get('/', function (request, response) {
    return response.render('index', {title: 'Welcome'});
})

module.exports = router;