import { NextFunction, Response } from "express";
import { UserService } from "../user";
import {
  AuthRequest,
  LoginRequest,
  RegisterRequest,
  SocialRequest,
} from "./AuthTypes";
import { validationResult } from "express-validator";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { TokenService } from "../token";
import { JwtPayload } from "jsonwebtoken";
import { CONFIG } from "../../config";

export default class AuthController {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private logger: Logger,
  ) {}

  async register(req: RegisterRequest, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      const { fullname, email, password, role } = req.body;

      this.logger.debug("REQUEST TO REGISTER A USER", {
        fullname,
        email,
        role,
        password: "*******",
      });

      let user = await this.userService.findUserByEmail(email);

      if (user) {
        next(createHttpError(400, "user already registered"));
        return;
      }

      const username = await this.userService.generateUserName(email);
      const hashedPassword =
        await this.userService.generateHashPassword(password);

      user = await this.userService.create({
        email,
        fullname,
        username,
        password: hashedPassword,
        role: role,
      });

      const payload: JwtPayload = {
        sub: String(user._id),
        role: user.role,
      };

      const token = await this.tokenService.persistRefreshToken(
        String(user._id),
      );

      const accessToken = this.tokenService.generateAccessToken(payload);
      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(token._id),
      });

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        // secure: true,
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
      });

      this.logger.info("user registered successfullly");
      res.status(201).json({
        id: user._id,
      });
    } catch (err) {
      return next(err);
    }
  }

  async login(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      const { email, password } = req.body;

      this.logger.debug("REQUEST TO LOGIN A USER", {
        email,
        password: "*******",
      });

      const user = await this.userService.findUserByEmail(email);

      if (!user) {
        next(createHttpError(400, "user not registered"));
        return;
      }

      const verifyPassword = await this.userService.comparePassword(
        password,
        user.personal_info.password,
      );

      if (!verifyPassword) {
        next(createHttpError(400, "invalid email or password"));
        return;
      }

      await this.tokenService.deleteRefreshTokens(String(user._id));

      const payload: JwtPayload = {
        sub: String(user._id),
        role: user.role,
      };

      const token = await this.tokenService.persistRefreshToken(
        String(user._id),
      );

      const accessToken = this.tokenService.generateAccessToken(payload);
      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(token._id),
      });

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        // secure: true,
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
      });

      this.logger.info("user logged in successfullly");
      res.status(200).json({
        id: user._id,
      });
    } catch (err) {
      return next(err);
    }
  }

  async self(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findUserByIdWithoutPassword(
        req.auth.sub,
      );

      res.status(200).json({ user });
    } catch (err) {
      return next(err);
    }
  }

  async refresh(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payload: JwtPayload = {
        sub: String(req.auth.sub),
        role: req.auth.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);
      const user = await this.userService.findUserById(req.auth.sub);

      if (!user) {
        const error = createHttpError(400, "User with token not exists");
        return next(error);
      }

      const newRefreshToken = await this.tokenService.persistRefreshToken(
        String(user._id),
      );

      await this.tokenService.deleteRefreshToken(String(req.auth.id));

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: newRefreshToken.id,
      });

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        // secure: true,
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
      });

      res.status(200).json({ id: user.id });
    } catch (error) {
      return next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await this.tokenService.deleteRefreshToken(String(req.auth.id));
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      this.logger.info("user has been logout scucessfully", {
        id: req.auth.sub,
      });
      res.json({});
    } catch (error) {
      return next(error);
    }
  }

  async socialAuthentication(
    req: SocialRequest,
    res: Response,
    next: NextFunction,
  ) {
    const { email, fullname } = req.user;

    try {
      const user = await this.userService.createSocialAuthUser({
        fullname,
        email,
      });

      const payload: JwtPayload = {
        sub: String(user?.id),
        role: user?.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      // Persist the refresh token
      const newRefreshToken = await this.tokenService.persistRefreshToken(
        String(user?._id),
      );

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
      });

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        // secure: true,
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
      });

      res.redirect(CONFIG.FRONTEND_URL!);
    } catch (err) {
      next(err);
      return;
    }
  }
}
