import winston from "winston";
import { CONFIG } from "../config";

const logger = winston.createLogger({
  level: "info",
  defaultMeta: {
    serviceName: "manthan-backend",
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      level: "info",
      silent: CONFIG.NODE_ENV === "test",
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "error.log",
      level: "error",

      silent: CONFIG.NODE_ENV === "test",
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "combined.log",
      level: "info",

      silent: CONFIG.NODE_ENV === "test",
    }),
  ],
});

export default logger;
