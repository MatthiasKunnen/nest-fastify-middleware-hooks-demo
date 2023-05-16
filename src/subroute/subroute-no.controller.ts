import {Controller, Get, Request} from '@nestjs/common';
import {RequestMaybeMiddleware, validateMiddlewareExecution} from '../validation';

@Controller()
export class SubrouteNoController {

    /**
     * Visiting `/subroute/no` route should **NOT** trigger the middleware. `/subroute/yes` should
     * trigger it (see {@see SubrouteController}).
     */
    @Get('/subroute/no')
    async no(@Request() request: RequestMaybeMiddleware) {
        return validateMiddlewareExecution({
            request,
            expectedExecutionAmount: 0,
        });
    }
}
