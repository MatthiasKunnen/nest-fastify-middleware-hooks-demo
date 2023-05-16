import {Injectable, NestMiddleware} from '@nestjs/common';
import {HttpAdapterHost} from '@nestjs/core';
import {RequestInMiddleware} from './validation';

@Injectable()
export class Middleware implements NestMiddleware {

    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
    ) {
    }

    use(request: RequestInMiddleware, reply: any, next: () => void) {
        if (request.middlewareExecutionCount === undefined) {
            request.middlewareExecutionCount = 1
        } else {
            request.middlewareExecutionCount++;
        }

        console.log(JSON.stringify({
            message: 'Middleware executed',
            fullUrl: this.httpAdapterHost.httpAdapter.getRequestUrl(request),
            requestUrl: request.url,
        }));
        next();
    }
}
