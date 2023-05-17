import {NestFactory} from '@nestjs/core';
import {ExpressAdapter} from '@nestjs/platform-express';
import {FastifyAdapter} from '@nestjs/platform-fastify';

import fastify from 'fastify';
import {AppModule} from './app.module';
import {CustomFastifyAdapter} from './custom-fastify-adapter/fastify-adapter';
import {PORT} from './env';

async function bootstrap() {
    // const adapter = new CustomFastifyAdapter();
    const adapter = new FastifyAdapter();
    // const adapter = new ExpressAdapter();

    const app = await NestFactory.create(
        AppModule,
        adapter,
    );

    await app.listen(PORT);
    console.log('Server is listening on port ' + PORT)
}

bootstrap().catch(error => {
    console.error(error);
});
