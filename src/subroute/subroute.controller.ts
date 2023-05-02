import {Controller, Get} from '@nestjs/common';

@Controller('/subroute')
export class SubrouteController {

    /**
     * Visiting /subroute route should trigger the middleware.
     */
    @Get()
    async test() {
        return {
            message: 'Should execute middleware once',
            controller: SubrouteController.name,
        };
    }

    /**
     * Visiting `/subroute/yes` route should trigger the middleware once. `/subroute/no` should not
     * (see {@see SubrouteNoController}).
     */
    @Get('/yes')
    async yes() {
        return {
            message: 'Should execute middleware once',
            controller: SubrouteController.name,
        };
    }
}
