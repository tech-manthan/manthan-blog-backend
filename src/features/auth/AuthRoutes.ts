import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

import AuthController from "./AuthController";
import { UserService } from "../user";
import { loginValidator, registerValidator } from "./AuthValidators";
import logger from "../../utils/logger";
import UserModel from "../user/UserModel";
import { TokenModel, TokenService } from "../token";
import {
  authenticateMiddleware,
  parseRefreshTokenMiddleware,
  validateRefreshTokenMiddleware,
} from "../../middlewares";
import { AuthRequest, SocialRequest } from "./AuthTypes";
import passport from "passport";
import { CONFIG } from "../../config";
import parseGoogleUserDataMiddleware from "../../middlewares/parseGoogleUserDataMiddleware";
import { parseGithubUserDataMiddleware } from "../../middlewares/parseGithubUserDataMiddleware";

const router = express.Router();

const userService = new UserService(UserModel);
const tokenService = new TokenService(TokenModel);

const authController = new AuthController(userService, tokenService, logger);

router.post(
  "/login",
  loginValidator,
  (req: Request, res: Response, next: NextFunction) => {
    authController.login(req, res, next);
  },
);

router.post(
  "/register",
  registerValidator,
  (req: Request, res: Response, next: NextFunction) => {
    authController.register(req, res, next);
  },
);

router.get(
  "/self",
  (req: Request, res: Response, next: NextFunction) => {
    authenticateMiddleware(req, res, next);
  },
  (req: Request, res: Response, next: NextFunction) => {
    authController.self(req as AuthRequest, res, next);
  },
);

router.post(
  "/refresh",
  (req: Request, res: Response, next: NextFunction) => {
    validateRefreshTokenMiddleware(req, res, next);
  },
  (req: Request, res: Response, next: NextFunction) => {
    authController.refresh(req as AuthRequest, res, next);
  },
);

router.post(
  "/logout",
  (req: Request, res: Response, next: NextFunction) => {
    authenticateMiddleware(req, res, next);
  },
  (req: Request, res: Response, next: NextFunction) => {
    parseRefreshTokenMiddleware(req, res, next);
  },
  (req: Request, res: Response, next: NextFunction) =>
    authController.logout(req as AuthRequest, res, next),
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  }) as RequestHandler,
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: CONFIG.FRONTEND_URL + "/auth/login",
  }) as RequestHandler,
  parseGoogleUserDataMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authController.socialAuthentication(req as SocialRequest, res, next),
);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["read:user", "user:email"],
    session: false,
  }) as RequestHandler,
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login",
  }) as RequestHandler,
  parseGithubUserDataMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authController.socialAuthentication(req as SocialRequest, res, next),
);

export default router;
