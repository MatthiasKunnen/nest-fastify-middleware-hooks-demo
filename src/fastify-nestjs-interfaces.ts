import type { AddContentTypeParser } from 'fastify';

export type NestFastifyBodyParserOptions = Omit<
    Parameters<AddContentTypeParser>[1],
    'parseAs'
>;

import { INestApplication } from '@nestjs/common';
import {
    FastifyBodyParser,
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginCallback,
    FastifyPluginOptions,
    FastifyRegisterOptions,
    RawServerBase,
} from 'fastify';
import {
    Chain as LightMyRequestChain,
    InjectOptions,
    Response as LightMyRequestResponse,
} from 'light-my-request';
import { Stats } from 'fs';

interface ExtendedInformation {
    fileCount: number;
    totalFileCount: number;
    folderCount: number;
    totalFolderCount: number;
    totalSize: number;
    lastModified: number;
}

interface ListDir {
    href: string;
    name: string;
    stats: Stats;
    extendedInfo?: ExtendedInformation;
}

interface ListFile {
    href: string;
    name: string;
    stats: Stats;
}

interface ListRender {
    (dirs: ListDir[], files: ListFile[]): string;
}

interface ListOptions {
    format: 'json' | 'html';
    names: string[];
    render: ListRender;
    extendedFolderInfo?: boolean;
    jsonFormat?: 'names' | 'extended';
}

// Passed on to `send`
interface SendOptions {
    acceptRanges?: boolean;
    cacheControl?: boolean;
    dotfiles?: 'allow' | 'deny' | 'ignore';
    etag?: boolean;
    extensions?: string[];
    immutable?: boolean;
    index?: string[] | false;
    lastModified?: boolean;
    maxAge?: string | number;
    serveDotFiles?: boolean;
}

export interface FastifyStaticOptions extends SendOptions {
    root: string | string[];
    prefix?: string;
    prefixAvoidTrailingSlash?: boolean;
    serve?: boolean;
    decorateReply?: boolean;
    schemaHide?: boolean;
    setHeaders?: (...args: any[]) => void;
    redirect?: boolean;
    wildcard?: boolean;
    list?: boolean | ListOptions;
    allowedPath?: (pathName: string, root?: string) => boolean;
    /**
     * @description
     * Opt-in to looking for pre-compressed files
     */
    preCompressed?: boolean;

    // Passed on to `send`
    acceptRanges?: boolean;
    cacheControl?: boolean;
    dotfiles?: 'allow' | 'deny' | 'ignore';
    etag?: boolean;
    extensions?: string[];
    immutable?: boolean;
    index?: string[] | false;
    lastModified?: boolean;
    maxAge?: string | number;
}


/**
 * @publicApi
 */
export interface NestFastifyApplication extends INestApplication {
    /**
     * A wrapper function around native `fastify.register()` method.
     * Example `app.register(require('@fastify/formbody'))
     * @returns {Promise<FastifyInstance>}
     */
    register<Options extends FastifyPluginOptions = any>(
        plugin:
            | FastifyPluginCallback<Options>
            | FastifyPluginAsync<Options>
            | Promise<{ default: FastifyPluginCallback<Options> }>
            | Promise<{ default: FastifyPluginAsync<Options> }>,
        opts?: FastifyRegisterOptions<Options>,
    ): Promise<FastifyInstance>;

    /**
     * Register Fastify body parsers on the fly. Will respect
     * the application's `rawBody` option.
     *
     * @example
     * const app = await NestFactory.create<NestFastifyApplication>(
     *   AppModule,
     *   new FastifyAdapter(),
     *   { rawBody: true }
     * );
     * // enable the json parser with a parser limit of 50mb
     * app.useBodyParser('application/json', { bodyLimit: 50 * 1000 * 1024 });
     *
     * @returns {this}
     */
    useBodyParser<TServer extends RawServerBase = RawServerBase>(
        type: string | string[] | RegExp,
        options?: NestFastifyBodyParserOptions,
        parser?: FastifyBodyParser<Buffer, TServer>,
    ): this;

    /**
     * Sets a base directory for public assets.
     * Example `app.useStaticAssets({ root: 'public' })`
     * @returns {this}
     */
    useStaticAssets(options: FastifyStaticOptions): this;

    /**
     * Sets a view engine for templates (views), for example: `pug`, `handlebars`, or `ejs`.
     *
     * Don't pass in a string. The string type in the argument is for compatibility reason and will cause an exception.
     * @returns {this}
     */
    setViewEngine(options: FastifyViewOptions | string): this;

    /**
     * A wrapper function around native `fastify.inject()` method.
     * @returns {void}
     */
    inject(): LightMyRequestChain;
    inject(opts: InjectOptions | string): Promise<LightMyRequestResponse>;

    /**
     * Starts the application.
     * @returns A Promise that, when resolved, is a reference to the underlying HttpServer.
     */
    listen(
        port: number | string,
        callback?: (err: Error, address: string) => void,
    ): Promise<any>;
    listen(
        port: number | string,
        address: string,
        callback?: (err: Error, address: string) => void,
    ): Promise<any>;
    listen(
        port: number | string,
        address: string,
        backlog: number,
        callback?: (err: Error, address: string) => void,
    ): Promise<any>;
}

/**
 * "fastify/view" interfaces
 * @see https://github.com/fastify/point-of-view/blob/master/types/index.d.ts
 * @publicApi
 */
export interface FastifyViewOptions {
    engine: {
        ejs?: any;
        eta?: any;
        nunjucks?: any;
        pug?: any;
        handlebars?: any;
        mustache?: any;
        'art-template'?: any;
        twig?: any;
        liquid?: any;
        dot?: any;
    };
    templates?: string;
    includeViewExtension?: boolean;
    options?: object;
    charset?: string;
    maxCache?: number;
    production?: boolean;
    defaultContext?: object;
    layout?: string;
    root?: string;
    viewExt?: string;
    propertyName?: string;
}
