import {Controller, Get} from '@nestjs/common';

@Controller()
export class SubrouteNoController {

    /**
     * Visiting `/subroute/no` route should **NOT** trigger the middleware. `/subroute/yes` should
     * trigger it (see {@see SubrouteController}).
     */
    @Get('/subroute/no')
    async no() {
        return {
            message: 'Middleware should not execute',
            controller: SubrouteNoController.name,
        };
    }
}
