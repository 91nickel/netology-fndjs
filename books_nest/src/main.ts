import { NestFactory } from '@nestjs/core';
import {NestExpressApplication} from "@nestjs/platform-express";
import { AppModule } from './app.module';
import {UseInterceptors} from "@nestjs/common";
import {ResWrapperInterceptor} from "./interceptors/res.wrapper.interceptor";
import {TestPipe} from "./pipes/test.pipe";
import {HttpExceptionFilter} from "./exception-filters/http.exception.filter";
import { join } from 'path';
import {WsAdapter} from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.useStaticAssets(join(__dirname, '..', '/public/'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useGlobalInterceptors(new ResWrapperInterceptor());
  // app.useGlobalPipes(new TestPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setViewEngine('ejs');
  const PORT = process.env.PORT || 3000
  await app.listen(PORT);
}
bootstrap();
