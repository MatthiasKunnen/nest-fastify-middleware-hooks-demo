import {Controller, Get, Header} from '@nestjs/common';
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
                    background-color: #303030;
                    color: white;
                }

                a {
                    border-bottom: 1px solid;
                    text-decoration: none;
                    color: inherit;
                }

                table {
                    font-size: inherit;
                }

                table td, table th {
                    text-align: left;
                    padding: 0.5em;
                }

                .fail {
                    color: #ff6464;
                }

                @media (prefers-color-scheme: light) {

                    body {
                        color: black;
                        background-color: white;
                    }

                    .fail {
                        color: #e80000;
                    }
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
                    const cssClass = response.success ? 'success' : 'fail'
                    return `
                        <tr>
                            <td class="${cssClass}">
                                <a href="${route}">${route}</a>
                            </td>
                            <td class="${cssClass}">
                                ${response.success ? 'PASS' : 'FAIL'}
                            </td>
                            <td>${response.expected}</td>
                            <td class="${cssClass}">
                                ${response.actual}
                            </td>
                            <td>${response.notes ?? ''}</td>
                        </tr>
                    `
                }).join('\n')}
            </table>
        `
    }
}
