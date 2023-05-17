import {Controller, Get, Header} from '@nestjs/common';
import {fetch} from 'undici';
import {ValidationResponse} from './validation';
import {PORT} from './env';
import {HttpAdapterHost} from '@nestjs/core';

@Controller()
export class TestResultsController {

    private readonly routes = [
        '/subroute',
        '/subroute/no',
        '/subroute/yes',
        '/similar/test',
        '/similar/123',
        '/a',
        '/a/b',
        '/a/b/c',
    ]

    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
    ) {
    }

    @Get()
    @Header('content-type', 'text/html')
    async index(){
        const httpAdapterInUse = this.httpAdapterHost.httpAdapter.constructor.name
        const results = await Promise.all(this.routes.map(async route => {
            const response = await fetch(`http://localhost:${PORT}${route}`)
                .then(response => response.json())

            return [route, response as ValidationResponse] as const
        }))

        return `
            <style>
                body {
                    font-family: ui-monospace, monospace;
                }
                
                a {
                    text-decoration: none;
                    color: inherit;
                }
                
                table td, table th {
                    text-align: left;
                    padding: 0.5em;
                }
                
                .fail {
                    color: red;
                }
            </style>
            <h1>Results for ${httpAdapterInUse}</h1>
            <p>
                The active adapter can be changed in main.ts.
            </p>
            <p>
                This table shows how many times the middleware has been called when the route in the
                first column is fetched.
            </p>
            <table>
                <tr>
                    <th>Route</th>
                    <th>Result</th>
                    <th>Expected</th>
                    <th>Actual</th>
                    <th>Notes</th>
                </tr>
                ${results.map(([route, response]) => {
                    return `
                    <tr>
                        <td class="${response.success ? 'success' : 'fail'}">
                            <a href="${route}">${route}</a>
                        </td>
                        <td class="${response.success ? 'success' : 'fail'}">${response.success ? 'PASS' : 'FAIL'}</td>
                        <td>${response.expected}</td>
                        <td class="${response.success ? 'success' : 'fail'}">${response.actual}</td>
                        <td>${response.notes ?? ''}</td>
                    </tr>
                    `
                }).join('\n')}
            </table>
        `
    }
}
