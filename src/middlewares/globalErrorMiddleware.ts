import { HttpError } from "http-errors";
import logger from "../utils/logger";
import { NextFunction, Request, Response } from "express";

const globalErrorMiddleware = (
  err: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  logger.error(err.message);

  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        msg: err.message,
        location: "",
        path: "",
      },
    ],
  });
};

export default globalErrorMiddleware;
