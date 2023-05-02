# NestJs fastify middleware: Problems and solutions


## Install instructions
Running this demo:
1. `yarn install`
1. `yarn run start`


## Repo scenario
The scenario in this repo is as follows:
- `SubrouteController` has two routes; `/subroute` and `/subroute/yes`
- `SubrouteNoController` has one route; `/subroute/no`
- `AbcController` has three routes; `/a`, `/a/b`, and `/a/b/c`
- Middleware that logs the request URL is applied to `SubrouteController` and `AbcController`

## Problems in the existing fastify-adapter

### Middleware is executed on subroutes
Registering middleware on a controller that has a `/` route, will lead to that middleware executing on all routes regardless of controller. This affects all subroutes of a route with middleware.

This is not a problem using the express adapter.

#### Test this
1. Go to `/subroute/no` and observe the logs. _middleware executed /about_ will be logged
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
