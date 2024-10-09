import { NextFunction, Request, Response } from "express";

export const parseGithubUserDataMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // console.log(req.user);
  // const { login, name } = req.user._json;

  const {
    login,
    name,
    email,
  }: {
    login: string;
    name: string;
    email: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = (req.user as Record<string, any>)._json;

  req.user = {
    fullname: name,
    email: email || login,
  };

  next();
};
