import { expressjwt, GetVerificationKey } from "express-jwt";
import jwksClient from "jwks-rsa";
import { CONFIG } from "../config";
import { Request } from "express";
import { AuthCookies } from "./types";

const authenticateMiddleware = expressjwt({
  secret: jwksClient.expressJwtSecret({
    jwksUri: CONFIG.JWKS_URI as string,
    cache: true,
    rateLimit: true,
  }) as GetVerificationKey,
  algorithms: ["RS256"],
  getToken(req: Request) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(" ")[1] !== "undefined") {
      const token = authHeader.split(" ")[1];
      if (token) {
        return token;
      }
    }

    const { accessToken } = req.cookies as AuthCookies;
    return accessToken;
  },
});

export default authenticateMiddleware;
