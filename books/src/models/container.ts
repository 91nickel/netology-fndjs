import {Container} from "inversify";
import "reflect-metadata";
import {Book} from "./book";
import {BooksRepository} from "./booksRepository";
import {IBook, IBooksRepository} from "./interfaces";

export const container  = new Container();

container.bind<IBooksRepository>(BooksRepository).toSelf();
container.bind<IBook>(Book).toSelf();
