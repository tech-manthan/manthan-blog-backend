import { expressjwt } from "express-jwt";
import { CONFIG } from "../config";
import { AuthCookies, IRefreshTokenPayload } from "./types";
import { Request } from "express";
import { TokenModel } from "../features/token";
import logger from "../utils/logger";

const validateRefreshTokenMiddleware = expressjwt({
  secret: CONFIG.REFRESH_TOKEN_SECRET as string,
  algorithms: ["HS256"],
  getToken(req: Request) {
    const { refreshToken } = req.cookies as AuthCookies;
    return refreshToken;
  },

  async isRevoked(req: Request, token) {
    try {
      const refreshToken = await TokenModel.findOne({
        _id: (token?.payload as IRefreshTokenPayload).id,
        user_id: token?.payload.sub,
      });
      return refreshToken === null;
    } catch {
      logger.error("error in checking refresh token revoked :", {
        id: (token?.payload as IRefreshTokenPayload).id,
      });
    }
    return true;
  },
});

export default validateRefreshTokenMiddleware;
