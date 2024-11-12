class ApiError extends Error {
  constructor(
    status,
    message = "Something went wrong",
    errors = [],
    stack = "",
    statusCode
  ) {
    super(message || "Something went wrong");
    this.statusCode = statusCode || status;
    this.data = null;
    this.message = message || "Something went wrong";
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
