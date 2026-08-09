import { httpStatusCodes } from "@/utils/types/enums/httpsCodes";
import BaseError from "./baseError";

class ValidationError extends BaseError {
  errors: Record<string, string>;

  constructor(
    errors: Record<string, string>,
    description = "Validation failed",
  ) {
    super("VALIDATION_ERROR", httpStatusCodes.BAD_REQUEST, true, description);
    this.errors = errors;
  }
}

export default ValidationError;
