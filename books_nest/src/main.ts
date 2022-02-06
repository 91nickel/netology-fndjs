import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {UseInterceptors} from "@nestjs/common";
import {ResWrapperInterceptor} from "./interceptors/res.wrapper.interceptor";
import {TestPipe} from "./pipes/test.pipe";
import {HttpExceptionFilter} from "./exception-filters/http.exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResWrapperInterceptor());
  // app.useGlobalPipes(new TestPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  const PORT = process.env.PORT || 3000
  await app.listen(PORT);
}
bootstrap();
