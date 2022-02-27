import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {BooksModule} from './books/books.module';
import { AuthModule } from './auth/auth.module';

const dbConnectionString = `mongodb://${process.env.DB_HOST || 'mongo'}:${process.env.DB_PORT || 27017}`;
const dbConnectionOptions = {
    user: process.env.DB_USER || 'root',
    pass: process.env.DB_PASS || '1234',
    dbName: process.env.DB_NAME || 'db',
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(dbConnectionString, dbConnectionOptions),
        BooksModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
