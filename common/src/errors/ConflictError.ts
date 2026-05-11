import { ApiError } from "./ApiError";

export class ConflictError extends ApiError {
  constructor(message: string = "Conflict") {
    super(409, message);
  }
}

