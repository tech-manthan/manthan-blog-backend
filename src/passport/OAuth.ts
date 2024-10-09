import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { CONFIG } from "../config";

export function initOauth() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: CONFIG.GOOGLE_CLIENT_ID!,
        clientSecret: CONFIG.GOOGLE_CLIENT_SECRET!,
        callbackURL: "http://localhost:8080/api/auth/google/callback",
      },
      function (accessToken, refreshToken, profile, cb) {
        cb(null, profile);
      },
    ),
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: CONFIG.GITHUB_CLIENT_ID!,
        clientSecret: CONFIG.GITHUB_CLIENT_SECRET!,
        callbackURL: "http://localhost:8080/api/auth/github/callback",
      },
      function (
        accessToken: string,
        refreshToken: string,
        profile: unknown,
        done: (error: unknown, data: unknown) => void,
      ) {
        done(null, profile);
      },
    ),
  );
}
