import UserSchema from './userSchema';
import {IUser} from "./interfaces";
import {UserType} from "./types";

export class User implements IUser {
    public _id = null;
    public username = '';
    public password = '';
    public name = '';
    public lastname = '';
    public session = '';

    constructor(fields: UserType) {
        Object.keys(this).forEach((key: any): void => {
            if (this.hasOwnProperty(key)) {
                this[key] = fields[key];
            }
        })
    }

    update(fields: UserType) {
        Object.keys(fields).forEach((key: any): void => {
                if (key === '_id') return;
                if (this.hasOwnProperty(key)) {
                    // @ts-ignore
                    this[key] = fields[key];
                }
            }
        )
        return this;
    }

    async save(): Promise<User> {
        console.log('User->save', this);
        if (typeof this._id) { // Значит объект в базе
            try {
                const result = await UserSchema.findByIdAndUpdate(this._id, {...this});
                console.log('User->saveOld->result', result);
            } catch (error) {
                console.error('User->saveOld->error', error);
            }
        } else { // а это не в базе
            try {
                const result = await new UserSchema({...this}).save();
                this._id = result._id;
                console.log('User->saveNew->result', result);
            } catch (error) {
                console.error('User->saveNew->error', error);
            }
        }
        return this;
    }

    async delete(): Promise<User> {
        console.log('User->delete', this._id);
        try {
            const result = await UserSchema.findByIdAndDelete(this._id);
            console.log('User->delete->result', result);
        } catch (error) {
            console.log('User->delete->error', error);
        }
        return this;
    }

    checkPassword(password: string): boolean {
        console.log('User->checkPassword', this.password, password, password === this.password);
        return password === this.password;
    }

    static async getUser(fields: UserType): Promise<User | null> {
        console.log('User->getUser', fields);
        try {
            const result = await UserSchema.findOne(fields);
            console.log('User.find()->result', result);
            if (result) {
                return new User(result);
            }
        } catch (error) {
            console.log('User.find()->error', error);
        }
        return null;
    }
}
