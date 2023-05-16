import {Controller, Get} from '@nestjs/common';

/**
 * Set up the routes to the same scenario as reported in
 * <https://github.com/nestjs/nest/issues/1628>.
 * Quick summary; when two routes with middleware are similar (e.g. /:id and /test) the middleware
 * should only execute once.
 */
@Controller('/similar')
export class SimilarRoutesController {

    /**
     * Visiting /similar/test route should trigger the middleware only once.
     */
    @Get('test')
    async test() {
        return {
            message: 'Should execute middleware once',
            controller: SimilarRoutesController.name,
        };
    }

    /**
     * Visiting `/similar/:id` route should trigger the middleware once.
     */
    @Get(':id')
    async id() {
        return {
            message: 'Should execute middleware once',
            controller: SimilarRoutesController.name,
        };
    }
}
