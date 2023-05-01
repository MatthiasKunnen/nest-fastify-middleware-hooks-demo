import {Controller, Get} from '@nestjs/common';

@Controller()
export class AboutController {

    @Get('/about')
    async about() {
        return {
            about: 'this'
        };
    }
}
