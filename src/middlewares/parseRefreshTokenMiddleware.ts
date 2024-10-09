import { expressjwt } from "express-jwt";
import { Request } from "express";
import { CONFIG } from "../config";
import { AuthCookies } from "./types";

const parseRefreshTokenMiddleware = expressjwt({
  secret: CONFIG.REFRESH_TOKEN_SECRET as string,
  algorithms: ["HS256"],
  getToken(req: Request) {
    const { refreshToken } = req.cookies as AuthCookies;
    return refreshToken;
  },
});

export default parseRefreshTokenMiddleware;
