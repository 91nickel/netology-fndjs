import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from './app.module';
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
import {join} from "path";
// const bodyParser = require("body-parser");


async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // app.use(bodyParser());
  app.use(cookieParser());
  app.use(csrf({cookie: true}));

  // app.useWebSocketAdapter(new WsAdapter(app));

  app.useStaticAssets(join(__dirname, '..', '/public/'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  // app.useGlobalInterceptors(new ResWrapperInterceptor());
  // app.useGlobalPipes(new TestPipe());
  // app.useGlobalFilters(new HttpExceptionFilter());

  app.setViewEngine('ejs');
  const PORT = process.env.NODE_PORT || 3000
  await app.listen(PORT);
}
bootstrap();

