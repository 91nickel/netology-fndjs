import passport from 'passport';
import PassportLocal from 'passport-local';
const LocalStrategy = PassportLocal.Strategy;
import {User} from '../models/user';
import {UserType} from "../models/types";

const options = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: false,
}

async function verify(username: string, password: string, done: Function) {
    console.log('verify()', username, password);
    try {
        console.log('LocalStrategyCallback()', username, password);
        const user = await User.getUser({username: username});
        console.log('User:', user);
        if (!user || !user.checkPassword(password)) {
            console.error('Error: check password', user)
            return done(null, false);
        }
        return done(null, user)
    } catch (error) {
        console.error('DeserializeUser->error()', error)
        return done(error)
    }
}

// Конфигурирование Passport для сохранения пользователя в сессии
passport.serializeUser(function (user: UserType, cb: Function): void {
    console.log('passport.serializeUser()', user, cb);
    cb(null, user._id)
})

passport.deserializeUser(async function (id: string, cb: Function) {
    console.log('passport.deserializeUser()', id, cb);
    try {
        const user = await User.getUser({_id: id});
        cb(null, user)
    } catch (error) {
        console.error('DeserializeUser->result()')
        return cb(error)
    }
})

//  Добавление стратегии для использования
passport.use('local', new LocalStrategy(options, verify));

export default passport;