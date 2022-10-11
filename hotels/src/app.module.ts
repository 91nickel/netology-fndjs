import {Injectable, MiddlewareConsumer, Module, NestMiddleware, NestModule} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config';
import {NextFunction} from "express";

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { HotelModule } from './hotel/hotel.module';
import { ReservationModule } from './reservation/reservation.module';

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
    UserModule,
    HotelModule,
    ReservationModule,
  ],
  controllers: [
      AppController,
  ],
  providers: [
      AppService,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SomeMiddleware).forRoutes('*');
  }
}

@Injectable()
export class SomeMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log('SomeMiddleware()');
        next();
    }
}

