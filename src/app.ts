import express, { Request, Response } from "express";
import cors from "cors";
import { AuthRoutes } from "./features/auth";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { globalErrorMiddleware } from "./middlewares";
import { CONFIG } from "./config";
import { initOauth } from "./passport/OAuth";
import passport from "passport";

const app = express();

initOauth();
app.use(passport.initialize());
app.use(
  cors({
    origin: CONFIG.FRONTEND_URL, // remove trailing slash if there
    credentials: true, // keep credentials true if required
  }),
);
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "ok" });
});

app.use("/api/auth", AuthRoutes);

app.use(globalErrorMiddleware);

export default app;
