const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    username: String,
    password: String,
    name: String,
    lastName: String,
    session: String,
})

module.exports = model('UserSchema', UserSchema);