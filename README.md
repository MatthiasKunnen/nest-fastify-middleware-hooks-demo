# NestJs fastify middleware: Problems and solutions
Reported here <https://github.com/nestjs/nest/issues/11585>.

## Install instructions
Running this demo:
1. `yarn install`
1. `yarn run start`
1. Open `/` in a browser. This page shows the results of fetching every route for the configured adapter.

<figure>
  <img src="img/fastify-result-dark.png#gh-dark-mode-only" alt="Fastify results"/>
  <img src="img/fastify-result-light.png#gh-light-mode-only" alt="Fastify results"/>
  <figcaption>Result for FastifyAdapter as shown when visiting `/`.</figcaption>
</figure>

## Repo scenario
The scenario in this repo is as follows:
```
SubRouteController (middleware applied)
├── /subroute
└── /subroute/yes

SubRouteNoController
└── /subroute/no

SimilarRoutesController (middleware applied)
├── /similar/test
└── /similar/:id

AbcController (middleware applied)
├── /a
├── /a/b
└── /a/b/c

TestResultsController
└── / (Shows the result of every route)
```

### Test results for all adapters
| Path          | Expected | Express | Fastify | CustomFastify |
|---------------|---------:|--------:|--------:|--------------:|
| /subroute     |        1 |       1 |       1 |             1 |
| /subroute/no  |        0 |       0 |       1 |             0 |
| /subroute/yes |        1 |       1 |       2 |             1 |
| /similar/test |        1 |       2 |       2 |             1 |
| /similar/123  |        1 |       1 |       1 |             1 |
| /a            |        1 |       1 |       1 |             1 |
| /a/b          |        1 |       1 |       2 |             1 |
| /a/b/c        |        1 |       1 |       3 |             1 |


## Problems in the existing fastify-adapter

### Middleware is executed on subroutes
Registering middleware on a controller that has a `/` route, will lead to that middleware executing on all routes regardless of controller. This affects all subroutes of a route with middleware.

This is not a problem using the express adapter.

#### Test this
1. Go to `/subroute/no` or view the results on `/`
1. (optional) Use the `express` adapter in `main.ts`, the middleware will not
   be executed

See [subroute.controller.ts](./src/subroute/subroute.controller.ts) and [subroute-no.controller.ts](./src/subroute/subroute-no.controller.ts) 

### Middleware is executed multiple times for the same route
If a controller that has middleware applied has _n_ routes that are prefixes of each other, the middleware will be called _n_ times for the most specific URL. It should only be called once.

#### Test this
Given the following routes: `/a`, `/a/b`, and `/a/b/c`, requesting `/a/b/c` results in 
```json lines
{"message":"Middleware executed","fullUrl":"/a/b/c","requestUrl":"/b/c"}
{"message":"Middleware executed","fullUrl":"/a/b/c","requestUrl":"/c"}
{"message":"Middleware executed","fullUrl":"/a/b/c","requestUrl":"/"}
```

See [src/abc.controller.ts](./src/abc.controller.ts).

## The cause
This behavior is intended for [middie](https://github.com/fastify/middie/) which is used by fastify. Instead, hooks should be used. 
See this issue: <https://github.com/fastify/middie/issues/113>.

References:
- [Fastify middleware](https://www.fastify.io/docs/latest/Reference/Middleware/)
- [Fastify hooks](https://www.fastify.io/docs/latest/Reference/Hooks/)

## A proposed solution
I have created a modified [`CustomFastifyAdapter`](./src/custom-fastify-adapter/fastify-adapter.ts) to use hooks instead of middie, this solves both problems.
This adapter can be tested by editing [main.ts](./src/main.ts).

Middie could be made entirely optional though it might still be required for express middleware. 
