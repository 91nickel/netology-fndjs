import {Injectable, MiddlewareConsumer, Module, NestMiddleware, NestModule} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config';
import {NextFunction} from "express";

// const mongo_express_config = require('mongo-express/config.default');
// console.log(mongo_express_config);

const dbConnectionString = `mongodb://${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 27017}`;
const dbConnectionOptions = {
  user: process.env.DB_USER || '',
  pass: process.env.DB_PASS || '',
  dbName: process.env.DB_NAME || 'db',
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(dbConnectionString, dbConnectionOptions),
  ],
  controllers: [
      AppController,
  ],
  providers: [
      AppService,
  ],
})

@Injectable()
export class SomeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('SomeMiddleware()');
    next();
  }
}

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SomeMiddleware).forRoutes('*');
  }
}
