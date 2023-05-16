import {Controller, Get, Request} from '@nestjs/common';
import {RequestMaybeMiddleware, validateMiddlewareExecution} from '../validation';

@Controller('/subroute')
export class SubrouteController {

    /**
     * Visiting /subroute route should trigger the middleware.
     */
    @Get()
    async test(@Request() request: RequestMaybeMiddleware) {
        return validateMiddlewareExecution({
            request,
            expectedExecutionAmount: 1,
        });
    }

    /**
     * Visiting `/subroute/yes` route should trigger the middleware once. `/subroute/no` should not
     * (see {@see SubrouteNoController}).
     */
    @Get('/yes')
    async yes(@Request() request: RequestMaybeMiddleware) {
        return validateMiddlewareExecution({
            request,
            expectedExecutionAmount: 1,
        });
    }
}
