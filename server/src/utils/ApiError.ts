class ApiError extends Error {
  statusCode: number;
  success: boolean;
  name: string;
  errors: any;
  stack?: string;

  constructor(statusCode = 500, message = "Internal Server Error", errors = null, stack = "") {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
