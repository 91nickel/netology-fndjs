const {v4: uuid} = require('uuid');
const UserSchema = require('./userSchema');

class User {

    _id;
    username;
    password;
    name;
    lastname;
    session;

    constructor(fields = {}) {
        Object.keys(this).forEach(function (key) {
            if (typeof fields[key] !== 'undefined')
                this[key] = fields[key]
        }.bind(this))
    }

    update(fields = {}) {
        Object.keys(fields).forEach(function (key) {
            if (key !== '_id' && typeof this[key] !== 'undefined') {
                this[key] = fields[key];
            }
        }.bind(this))
        return this;
    }

    save() {
        console.log('User->save', this);
        if (typeof this._id === 'undefined') { // Значит объект еще не в базе
            return new UserSchema({...this}).save()
                .then(function (result) {
                    console.log('User->saveNew->result', result);
                    this._id = result._id;
                    return this;
                }.bind(this))
                .catch(function (error) {
                    console.log('User->saveNew->error', error);
                    return error;
                });
        } else { // а это уже в базе
            return UserSchema.findByIdAndUpdate(this._id, {...this})
                .then(function (result) {
                    console.log('User->saveOld->result', result);
                    return this;
                }.bind(this))
                .catch(function (error) {
                    console.log('User->saveOld->error', error);
                    return error;
                });
        }
    }

    delete() {
        console.log('User->delete', this._id);
        return UserSchema.findByIdAndDelete(this._id)
            .then(function (result) {
                console.log('User->delete->result', result);
                return result;
            })
            .catch(function (error) {
                console.log('User->delete->error', error);
                return error;
            });
    }

    checkPassword(password) {
        console.log('User->checkPassword', this.password, password, password === this.password);
        return password === this.password;
    }

    static find(filter = {}) {
        console.log('User::find()', filter);
        return UserSchema.find(filter)
            .then(function (result) {
                console.log('User.find()->result', result);
                if (result._id) {
                    return new User(result);
                } else {
                    return null;
                }
            })
            .catch(function (error) {
                console.log('User.find()->error', error)
            })
    }

    static findOne(filter = {}, cb = function (err, user) {
        if (err) return err;
        return user
    }) {
        console.log('User::findOne()', filter);
        return UserSchema.findOne(filter)
            .then(function (result) {
                console.log('User.findOne()->result', result);
                if (result) {
                    return cb(null, new User(result));
                } else {
                    return cb(null, null);
                }
            })
            .catch(function (error) {
                console.log('User.find()->error', error)
                return cb(error)
            })
    }

}

module.exports = User;

