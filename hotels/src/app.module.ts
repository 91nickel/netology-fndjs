import {
  Injectable,
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NextFunction } from 'express';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { HotelModule } from './hotel/hotel.module';
import { ReservationModule } from './reservation/reservation.module';
import { SupportRequestModule } from './support-request/support-request.module';
import { AuthModule } from './auth/auth.module';

const dbConnectionString = `mongodb://${process.env.DB_HOST || 'mongo'}:${
  process.env.DB_PORT || 27017
}`;
const dbConnectionOptions = {
  user: process.env.DB_USER || 'root',
  pass: process.env.DB_PASS || '1234',
  dbName: process.env.DB_NAME || 'db',
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(dbConnectionString, dbConnectionOptions),
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
    UserModule,
    HotelModule,
    ReservationModule,
    SupportRequestModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SomeMiddleware).forRoutes('*');
  }
}

@Injectable()
export class SomeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}
