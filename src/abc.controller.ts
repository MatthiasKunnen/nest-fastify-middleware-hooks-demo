import {Controller, Get} from '@nestjs/common';

@Controller()
export class AbcController {

    @Get('/a')
    async a() {
        return {
            message: 'Should execute middleware once',
            controller: AbcController.name,
        };
    }

    @Get('/a/b')
    async ab() {
        return {
            message: 'Should execute middleware once',
            controller: AbcController.name,
        };
    }

    @Get('/a/b/c')
    async abc() {
        return {
            message: 'Should execute middleware once',
            controller: AbcController.name,
        };
    }
}
