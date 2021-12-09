import express from 'express';
const router = express.Router();
import User from '../models/user.js';
import passport from'../middleware/passport.js';

router.use(passport.initialize());
router.use(passport.session());

router.get('/', function (request, response) {
    console.log('GET /user');
    return response.render('user/index', {title: 'Управление пользователем'})
})

router.get('/login', function (request, response) {
    console.log('GET /user/login');
    if (request.isAuthenticated && request.isAuthenticated()) {
        return response.redirect('/user/me');
    }
    return response.render('user/login', {title: 'Вход'})
})

router.get('/logout', function (request, response) {
    console.log('GET /user/logout');
    request.logout();
    response.redirect('/user/login');
})

router.get('/signup', function (request, response) {
    console.log('GET /user/signup');
    if (request.isAuthenticated && request.isAuthenticated()) {
        return response.redirect('/user/me');
    }
    return response.render('user/signup', {title: 'Регистрация пользователя', fields: Object.keys(new User)})
})

router.get('/me', function (request, response, next) {
        console.log('GET /user/me', request.user);
        if (!request.isAuthenticated || !request.isAuthenticated()) {
            if (request.session) {
                request.session.returnTo = request.originalUrl || request.url
            }
            return response.redirect('/user/login');
        }
        next();
    },
    function (request, response) {
        console.log('GET /user/me->next()');
        return response.render('user/me', {title: 'Профиль', fields: request.user})
    }
)

router.post('/login', passport.authenticate('local', {
        failureRedirect: '/user',
        successRedirect: '/user/me',
    }),
    function (request, response) {
        console.log('Login success', request.body, request.user);
        return response.redirect('/user');
    }
)

router.post('/signup', async function (request, response) {
    console.log('POST /user/signup', request.body);
    const body = request.body;
    if (!body) {
        console.error('Request body is empty');
        return response.status(500).send('Request body is empty')
    }
    if (!body.username) {
        console.error('Username is empty');
        return response.status(500).send('Username is empty')
    }
    if (!body.password) {
        console.error('Password is empty');
        return response.status(500).send('Password is empty')
    }
    const existedUser = await User.findOne({username: body.username});
    if (existedUser) {
        console.error('User already exists:', existedUser);
        return response.status(500).send('User already exists');
    }

    const user = new User(request.body);
    await user.save();
    return response.redirect('/user/me');
})

export default router;