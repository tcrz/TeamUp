export interface ApiResponse<T = unknown> {
  message: string;
  data: T | null;
}

/**
 * Builds the response body. Pure - no Express, no I/O - so it unit-tests
 * directly without mocking `res`.
 *
 * The HTTP status is deliberately NOT mirrored in here: it already travels on
 * the response, and duplicating it would mean writing it twice per call with
 * nothing to keep the two in step.
 *
 *   res.status(201).json(buildResponse("Task created successfully", task))
 */
export const buildResponse = <T>(
  message: string,
  data: T | null = null,
): ApiResponse<T> => ({ message, data });
