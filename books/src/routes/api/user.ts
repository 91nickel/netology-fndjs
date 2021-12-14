import express from 'express';
const router = express.Router();
import passport from '../../middleware/passport';
import {User} from '../../models/user';

router.use(passport.initialize());
router.use(passport.session());

router.get('/', function (request: any, response: any) {
        return response.status(200).json({message: 'Hello'})
    }
)

router.get('/me', function (request: any, response: any, next: Function) {
        console.log('GET /api/user/me', request.user);
        if (!request.isAuthenticated || !request.isAuthenticated()) {
            return response.redirect('/api/user/unauthorized');
        }
        next();
    },
    function (request: any, response: any) {
        return response.status(200).json(request.user)
    }
)
router.get('/unauthorized', function (request: any, response: any) {
        return response.status(401).json({success: false, message: '401 | Unauthorized'})
    }
)

router.get('/logout', function (request: any, response: any) {
    console.log('GET /api/user/logout');
    if (!request.isAuthenticated || !request.isAuthenticated()) {
        return response.redirect('/api/user/unauthorized');
    }
    request.logout();
    return response.status(200).json({success: true});
})

router.post('/login', passport.authenticate('local', {
        failureRedirect: '/api/user/unauthorized',
    }),
    function (request: any, response: any) {
        console.log('POST /api/user/login', request.user);
        return response.status(200).json({success: true});
    }
)

router.post('/signup', async function (request: any, response: any) {
    const body = request.body;
    if (!body) {
        console.error('Request body is empty');
        return response.status(500).json({success: false, message: 'Request body is empty'})
    }
    if (!body.username) {
        console.error('Username is empty');
        return response.status(500).json({success: false, message: 'Username is empty'})
    }
    if (!body.password) {
        console.error('Password is empty');
        return response.status(500).json({success: false, message: 'Password is empty'})
    }
    const existedUser = await User.getUser({username: body.username});
    if (existedUser) {
        console.error('User already exists:', existedUser);
        return response.status(500).json({success: false, message: 'User already exists'})
    }
    const user = new User(body);
    const result = await user.save();
    if (result._id)
        return response.status(200).json({success: true, user: result});

    return response.status(500).json({success: false, message: 'Undefined error'})
})

export default router;

