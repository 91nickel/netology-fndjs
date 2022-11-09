import { NestFactory }            from '@nestjs/core'
import { NestExpressApplication } from "@nestjs/platform-express"
import { IoAdapter }              from '@nestjs/platform-socket.io'
import { WsAdapter }              from "@nestjs/platform-ws";
import * as http                  from 'http'
import * as bodyParser            from "body-parser"
import * as cookieParser          from "cookie-parser"
import * as csrf                  from "csurf"
import { join }                   from "path"
import { AppModule }              from './app.module'
import { JwtAuthGuard }           from "./auth/guards/jwt-auth.guard"


async function bootstrap() {

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: {
            origin: "*",
            methods: ["GET,HEAD,OPTIONS,POST,PUT"],
            allowedHeaders: [
                "Content-Type",
                "X-CSRF-TOKEN",
                "access-control-allow-methods",
                "Access-Control-Allow-Origin",
                "access-control-allow-credentials",
                "access-control-allow-headers",
            ],
            credentials: true,
        },
        // bodyParser: true,
    });

    // app.use(bodyParser());
    app.use(cookieParser());

    // app.use(csrf({cookie: true}));

    // app.useWebSocketAdapter(new WsAdapter(app));
    app.useWebSocketAdapter(new IoAdapter(app));

    app.useGlobalGuards(new JwtAuthGuard());
    // app.useGlobalInterceptors(new ResWrapperInterceptor());
    // app.useGlobalPipes(new TestPipe());
    // app.useGlobalFilters(new HttpExceptionFilter());

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('ejs');
    const PORT = process.env.NODE_PORT || 3000
    await app.listen(PORT);
}

bootstrap();

