# NestJs executes middleware on subroutes when using fastify

The problem: middleware is executed on subroutes when using fastify.

E.g. registering middleware on a controller that has a `/` route, will lead to that middleware
executing on all routes.

This is not a problem using the express adapter.

## Reproduction
1. `yarn install`
2. `yarn run start`
3. Go to `/about`, _middleware executed_ will be logged
4. (optional) Use the `express` adapter in `main.ts`, the middleware will not
   be executed

## The cause
This behavior is intended for middie which is used by fastify. Instead, hooks should be used. 
See this issue I made: <https://github.com/fastify/middie/issues/113>.

References:
- [Fastify middleware](https://www.fastify.io/docs/latest/Reference/Middleware/)
- [Fastify hooks](https://www.fastify.io/docs/latest/Reference/Hooks/)
