import { httpStatusCodes } from "../types/enums/httpsCodes";
import BaseError from "./baseError";

type PgError = {
  code?: string;
  detail?: string;
  column?: string;
  message?: string;
  constraint?: string;
};

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

export function handlePgError(err: PgError) {
  switch (err.code) {
    //Bad Input
    case "22P02": // invalid_text_representation
    case "22P02": // invalid_text_representation
    case "22007": // invalid_datetime_format
    case "22001": // string too long
    case "42601": // Syntax error
      throw new DatabaseError("Invalid input", {
        details: err.message,
      });

    case "23505": // unique_violation
      throw new DatabaseError("Duplicate resource", {
        details: err.message || err.constraint,
      });

    case "23503": // foreign_key_violation
      throw new DatabaseError("Invalid reference", {
        details: err.message,
      });

    case "23502": // not_null_violation
      throw new DatabaseError("Missing required field", {
        details: err.column,
      });

    case "23514": // check_violation
      throw new DatabaseError("Constraint failed", {
        details: err.constraint,
      });

    case "42703": // undefined_column
    case "42P01": // undefined_table
    case "42883": // undefined_function
      throw new DatabaseError("Database query error");

    case "40001": // serialization_failure
    case "40P01": // deadlock_detected
      throw new DatabaseError("Conflict, please retry");

    case "08006": // connection_failure
    case "53300": // too_many_connections
      throw new DatabaseError("Database unavailable");

    default:
      throw new DatabaseError("Internal server error");
  }
}

export default DatabaseError;
