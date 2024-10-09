import { NextFunction, Request, Response } from "express";

export const parseGoogleUserDataMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    given_name: fullname,
    email,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = (req.user as Record<string, any>)._json;

  const Data: object = {
    fullname,
    email,
  };

  req.user = Data;

  next();
};

export default parseGoogleUserDataMiddleware;
