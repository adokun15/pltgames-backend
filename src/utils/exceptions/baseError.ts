//Extending the Error class
class BaseError extends Error {
  isOperational: boolean;
  statusCode: number;
  name: string;
  description: string;

  constructor(
    name: string,
    statusCode: number,
    isOperational: boolean,
    description: string,
  ) {
    //From THE parent class!
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    //Adding this to the Error Class
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}
export default BaseError;
