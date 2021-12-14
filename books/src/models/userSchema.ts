import pkg from 'mongoose';
const {Schema, model} = pkg;

const UserSchema = new Schema({
    username: String,
    password: String,
    name: String,
    lastName: String,
    session: String,
})

export default model('UserSchema', UserSchema);