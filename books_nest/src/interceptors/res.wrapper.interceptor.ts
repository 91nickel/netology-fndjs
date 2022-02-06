import {
    CallHandler,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';

import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";

@Injectable()
export class ResWrapperInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const response: Response = context.switchToHttp().getResponse<Response>();
        console.log('before...');
        const now = Date.now();
        return next.handle().pipe(
            tap(() => {
                console.log(`After... ${Date.now() - now} ms`);
            }),
            map(data => {
                return {status: 'success', data: data};
            }),
            // @ts-ignore
            catchError((err) => {
                response.status(HttpStatus.BAD_REQUEST);
                return of({status: 'fail', data: err.message});
                // return throwError()
            }),
        )
    }
}