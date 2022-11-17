import { NestFactory }            from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter }              from '@nestjs/platform-socket.io';
import * as cookieParser          from 'cookie-parser';
import { join }                   from 'path';
import { AppModule }              from './app.module';
import { JwtAuthGuard }           from './auth/guards/jwt-auth.guard';
import { YandexGuard }            from "./auth/guards/yandex.guard";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: '*',
      methods: ['GET,HEAD,OPTIONS,POST,PUT'],
      allowedHeaders: [
        'Content-Type',
        'X-CSRF-TOKEN',
        'access-control-allow-methods',
        'Access-Control-Allow-Origin',
        'access-control-allow-credentials',
        'access-control-allow-headers',
      ],
      credentials: true,
    },
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalGuards(new JwtAuthGuard());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  const PORT = process.env.NODE_PORT || 3000;
  await app.listen(PORT);
}

bootstrap();
