import {IBook} from "./interfaces";

export type BookType = {
    //[key: string]: object | null | string | number | object[] | undefined
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

export type BookTypeKeys = keyof IBook;
