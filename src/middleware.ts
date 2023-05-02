import {Injectable, NestMiddleware} from '@nestjs/common';
import {AbstractHttpAdapter, HttpAdapterHost} from '@nestjs/core';

@Injectable()
export class Middleware implements NestMiddleware {

    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
    ) {
    }

    async use(request: any, reply: any, next: () => void): Promise<any> {
        console.log(JSON.stringify({
            message: 'Middleware executed',
            fullUrl: this.httpAdapterHost.httpAdapter.getRequestUrl(request),
            requestUrl: request.url,
        }));
        next();
    }
}
