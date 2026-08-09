import { httpStatusCodes } from "../types/enums/httpsCodes";
import BaseError from "./baseError";
class NotFoundError extends BaseError {
  constructor(description: string = "Not found.") {
    super("Not_Found", httpStatusCodes.NOT_FOUND, true, description);
  }
}

export default NotFoundError;
