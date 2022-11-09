import { Controller, Get, Next, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService }                                                                from './app.service';
import { Request, Response }                                                from 'express';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get('/')
    getHello(
        @Req() request: Request,
        @Res() response: Response,
    ) {
        console.log('AppController.getHello()')
        // return response.send(this.appService.getHello())
        return response.render('index', {title: 'Index', scripts: ['/script.js']})
    }
}
