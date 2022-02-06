import {ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException} from '@nestjs/common';
import {Request, Response} from 'express';

@Catch(BadRequestException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        console.log('HttpExceptionFilter->catch()...');
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus() || 500;

        const body = {
            timestamp: new Date().toISOString(),
            status: 'fail',
            data: exception.message || 'Internal server error',
            code: status,
        }
        console.log(body);
        return response.status(status).json(body);
    }
}