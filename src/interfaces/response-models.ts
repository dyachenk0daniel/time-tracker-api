export class ErrorBody {
  success = false as const;
  error: {
    code: string;
    message: string;
    details?: string | Record<string, string>;
  };

  constructor(code: string, message: string, details?: string | Record<string, string>) {
    this.error = { code, message, details };
  }
}

export class ResponseBody<T> {
  success = true as const;
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}
