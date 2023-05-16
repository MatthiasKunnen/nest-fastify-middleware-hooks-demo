import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {Middleware} from './middleware';
import {AbcController} from './abc.controller';
import {SubrouteController} from './subroute/subroute.controller';
import {SubrouteNoController} from './subroute/subroute-no.controller';
import {SimilarRoutesController} from './similar-routes.controller';

@Module({
    controllers: [
        AbcController,
        SimilarRoutesController,
        SubrouteController,
        SubrouteNoController,
    ]
})
export class AppModule  implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(Middleware)
            .forRoutes(AbcController, SimilarRoutesController, SubrouteController);
    }
}
