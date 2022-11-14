import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  @Get('/')
  getHello(@Req() request: Request, @Res() response: Response) {
    return response.render('index', {
      title: 'Index',
      scripts: ['/script.js'],
    });
  }
}
