import { httpStatusCodes } from "../types/enums/httpsCodes";
import BaseError from "./baseError";

//Dberror: Connect;
class DatabaseError extends BaseError {
  originalError: unknown;

  constructor(
    description = "Database operation failed",
    originalError?: unknown,
  ) {
    super(
      "DATABASE_ERROR",
      httpStatusCodes.INTERNAL_SERVER,
      false,
      description,
    );
    this.originalError = originalError;
  }
}

export default DatabaseError;
