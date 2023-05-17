import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {Middleware} from './middleware';
import {AbcController} from './abc.controller';
import {SubrouteController} from './subroute/subroute.controller';
import {SubrouteNoController} from './subroute/subroute-no.controller';
import {SimilarRoutesController} from './similar-routes.controller';
import {TestResultsController} from './test-results.controller';

@Module({
    controllers: [
        AbcController,
        SimilarRoutesController,
        SubrouteController,
        SubrouteNoController,
        TestResultsController,
    ]
})
export class AppModule  implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(Middleware)
            .forRoutes(AbcController, SimilarRoutesController, SubrouteController);
    }
}
