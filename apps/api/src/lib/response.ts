export interface ApiResponse<T = unknown> {
  message: string;
  data: T | null;
}

export const buildResponse = <T>(
  message: string,
  data: T | null = null,
): ApiResponse<T> => ({ message, data });
