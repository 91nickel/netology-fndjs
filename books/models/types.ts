import {IBook, IUser} from "./interfaces";

export type BookType = {
    _id?: object | null
    title?: string
    description?: string
    authors?: string
    favorite?: string
    fileCover?: string
    fileName?: string
    fileBook?: string
    comments?: object[]
    counter?: number
}

export type UserType = {
    _id?: object | string | null;
    username?: string;
    password?: string;
    name?: string;
    lastname?: string;
    session?: string;
}

export type BookTypeKeys = keyof IBook;
export type UserTypeKeys = keyof IUser;
