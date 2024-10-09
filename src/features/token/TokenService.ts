import createHttpError from "http-errors";
import { JwtPayload, sign } from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";
import { CONFIG } from "../../config";
import { Model } from "mongoose";
import { Token } from "./TokenType";

export default class TokenService {
  constructor(private tokenModel: Model<Token>) {}

  generateAccessToken(payload: JwtPayload) {
    let privateKey: Buffer;
    try {
      privateKey = fs.readFileSync(
        path.join(__dirname, "../../../certs/private.pem"),
      );
    } catch {
      const error = createHttpError(500, "error while reading priavte key");
      throw error;
    }

    const accessToken = sign(payload, privateKey, {
      expiresIn: "1h",
      algorithm: "RS256",
      issuer: "auth-service",
    });
    return accessToken;
  }

  generateRefreshToken(payload: JwtPayload) {
    const refreshToken = sign(payload, CONFIG.REFRESH_TOKEN_SECRET!, {
      expiresIn: "1y",
      algorithm: "HS256",
      issuer: "auth-service",
      jwtid: String(payload.id),
    });

    return refreshToken;
  }

  async persistRefreshToken(userId: string) {
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
    const token = await this.tokenModel.create({
      expire_at: new Date(Date.now() + MS_IN_YEAR),
      user_id: userId,
    });
    return token;
  }

  async deleteRefreshToken(tokenId: string) {
    return await this.tokenModel.findByIdAndDelete(tokenId);
  }

  async deleteRefreshTokens(userId: string) {
    return await this.tokenModel.deleteMany({
      user_id: userId,
    });
  }
}
