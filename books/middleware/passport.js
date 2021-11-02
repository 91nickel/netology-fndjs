const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

const options = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: false,
}

function verify(username, password, done) {
    console.log('verify()', username, password);
    User.findOne({username: username}, function (err, user) {
        console.log('LocalStrategyCallback()', username, password);
        console.log('User:', user);
        console.log('Error:', err);
        if (err) {
            console.error('Error:', err)
            return done(err);
        }
        if (!user || !user.checkPassword(password)) {
            console.error('Error: check password', user)
            return done(null, false);
        }
        console.log('Done...')
        return done(null, user);
    });
}

// Конфигурирование Passport для сохранения пользователя в сессии
passport.serializeUser(function (user, cb) {
    console.log('passport.serializeUser()', user, cb);
    cb(null, user._id)
})

passport.deserializeUser(function (id, cb) {
    console.log('passport.deserializeUser()', id, cb);
    User.findOne({_id: id}, function (err, user) {
        if (err) {
            return cb(err)
        }
        cb(null, user)
    })
})

//  Добавление стратегии для использования
passport.use('local', new LocalStrategy(options, verify));

module.exports = {passport};