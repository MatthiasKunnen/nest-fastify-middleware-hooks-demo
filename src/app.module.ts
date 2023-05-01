import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {IndexController} from './index.controller';
import {AboutController} from './about.controller';
import {Middleware} from './middleware';

@Module({
    controllers: [
        IndexController,
        AboutController,
    ]
})
export class AppModule  implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(Middleware)
            .forRoutes(IndexController);
    }
}
