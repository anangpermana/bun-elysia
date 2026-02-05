export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;

    // penting biar instanceof jalan normal
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
