import mongoose from "mongoose";

import { CONFIG } from "../config";
import logger from "../utils/logger";

const connectDb = async () => {
  try {
    const URI = CONFIG.DB_CONNECTION_STRING;

    mongoose.connection.on("connecting", function () {
      logger.info("trying to establish a connection to database");
    });

    mongoose.connection.on("connected", function () {
      logger.info("connection established successfully");
    });

    mongoose.connection.on("error", function (err) {
      logger.error("connection to mongo failed " + err);
      process.exit(0);
    });

    mongoose.connection.on("disconnected", function () {
      logger.info("db connection closed");
    });

    await mongoose.connect(URI!, {
      dbName: "manthan-blog",
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.error("connection to mongo failed " + err);
    }
    process.exit(0);
  }
};

export default connectDb;
