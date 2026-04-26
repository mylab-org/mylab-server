export interface SuccessResponse<T> {
  status: string | number;
  data: T;
}

export interface ErrorResponse {
  status: string | number;
  code: string;
  message: string;
}
