export interface RequestInMiddleware {
    middlewareExecutionCount?: number;
    url: string;
}

export type RequestMaybeMiddleware = RequestInMiddleware | {
    raw: RequestInMiddleware
}

export interface ValidationResponse {
    actual: number,
    expected: number,
    notes?: string,
    success: boolean,
}

export function validateMiddlewareExecution(
    {
        request,
        expectedExecutionAmount,
        notes,
    }: {
        request: RequestMaybeMiddleware,
        expectedExecutionAmount: number,
        notes?: string
    },
): ValidationResponse {
    let actualExecutionCount: number | undefined

    if ('middlewareExecutionCount' in request) {
        // ExpressAdapter and CustomFastifyAdapter
        actualExecutionCount = request.middlewareExecutionCount
    } else if ('raw' in request) {
        // FastifyAdapter
        actualExecutionCount = request.raw.middlewareExecutionCount
    }

    actualExecutionCount ??= 0

    return {
        success: actualExecutionCount === expectedExecutionAmount,
        actual: actualExecutionCount,
        expected: expectedExecutionAmount,
        notes: notes,
    }
}
