//Handle error MIDDLEWARE
import { NextFunction, Request, Response } from "express";
import NotFoundError from "../exceptions/NotFound";
import winston from "winston";
//import DiscordTransport from "winston-discord-transport";

export function errorResponseHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const customError: boolean =
    error.constructor.name === "NodeError" ||
    error.constructor.name === "SyntaxError"
      ? false
      : true;
  res.status(error.statusCode || 500).json({
    response: "Error",
    error: {
      type: customError === false ? "UnhandledError" : error.constructor.name,
      path: req.path,
      statusCode: error.statusCode || 500,
      message: error.message,
    },
  });

  next(error);
}

//Route Not Found!
export function RouteNotFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);

  //Log to Console / Discord
  //logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
  next(error);
}

//CatCH aSYNC eRRORS
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

//Handle error logging
export const errorLoggingMiddleWare = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //const customError: boolean = error.constructor.name === 'NodeError' || error.constructor.name === 'SyntaxError' ? false : true;

  console.log("ERROR");
  console.log(
    `Type: ${error.constructor.name === "NodeError" ? "UnhandledError" : error.constructor.name}`,
  );
  console.log("Path: " + req.path);
  console.log(`Status code: ${error.statusCode || 500}`);
  console.log(error.stack);
};

/*
// Global error handler
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }
  // Handle validation errors (e.g., from express-validator)
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
    isOperational = true;
  }
  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    isOperational = true;
  }
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    isOperational = true;
  }
  // Handle MongoDB/Mongoose errors
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    isOperational = true;
  }
  else if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
    isOperational = true;
  }
  // Handle syntax errors in JSON
  else if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON payload';
    isOperational = true;
  }

  // Log error
  const logMessage = {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message: err.message,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  };

  if (statusCode >= 500) {
    logger.error('Server Error', {
      ...logMessage,
      stack: err.stack,
    });
  } else {
    logger.warn('Client Error', logMessage);
  }

  // Send error response
  const response: any = {
    success: false,
    message,
    statusCode,
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.error = err;
  }

  res.status(statusCode).json(response);
};

*/

//Logging to Discord!
/*
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'ptlgames-backend' },
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
   // new DiscordTransport({
    //  defaultMeta: { }
  //  }),
    
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, stack }) => {
          return `${timestamp} [${level}]: ${stack || message}`;
        })
      ),
    }),

    // Write all errors to error.log
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
      }),
      ],
      });
      
      */

/*
     logger.log({
  level: "error",
  message: "Error intializing service",
  meta: {
    additionalKey: "someValue",
    },
  error: new Error(),
  });
*/
