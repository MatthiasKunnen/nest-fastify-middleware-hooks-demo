import {Injectable, NestMiddleware} from '@nestjs/common';

@Injectable()
export class Middleware implements NestMiddleware {

    async use(request: any, reply: any, next: () => void): Promise<any> {
        console.log('Middleware executed', request.url);
        next();
    }
}
