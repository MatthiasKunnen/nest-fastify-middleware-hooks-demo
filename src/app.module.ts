import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {Middleware} from './middleware';
import {AbcController} from './abc.controller';
import {SubrouteController} from './subroute/subroute.controller';
import {SubrouteNoController} from './subroute/subroute-no.controller';

@Module({
    controllers: [
        AbcController,
        SubrouteController,
        SubrouteNoController,
    ]
})
export class AppModule  implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(Middleware)
            .forRoutes(AbcController, SubrouteController);
    }
}
