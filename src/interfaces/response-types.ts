export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string | Record<string, string>;
  };
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
