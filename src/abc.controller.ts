import {Controller, Get, Request} from '@nestjs/common';
import {RequestMaybeMiddleware, validateMiddlewareExecution} from './validation';

@Controller()
export class AbcController {

    @Get('/a')
    async a(@Request() request: RequestMaybeMiddleware) {
        return validateMiddlewareExecution({
            request,
            expectedExecutionAmount: 1,
        });
    }

    @Get('/a/b')
    async ab(@Request() request: RequestMaybeMiddleware) {
        return validateMiddlewareExecution({
            request,
            expectedExecutionAmount: 1,
        });
    }

    @Get('/a/b/c')
    async abc(@Request() request: RequestMaybeMiddleware) {
        return validateMiddlewareExecution({
            request,
            expectedExecutionAmount: 1,
        });
    }
}
