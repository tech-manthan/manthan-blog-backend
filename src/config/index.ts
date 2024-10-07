import dotenv from "dotenv";

dotenv.config();

const { NODE_ENV, PORT, DB_CONNECTION_STRING } = process.env;

export const CONFIG = Object.freeze({
  NODE_ENV,
  PORT,
  DB_CONNECTION_STRING,
});
