import {Controller, All, Get, Req, Res, Next} from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All('*')
  all(@Req() request, @Res() response: Response, @Next() next) {
    console.log('AppController->all()');
    response.cookie("XSRF-TOKEN", request.csrfToken());
    next();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
