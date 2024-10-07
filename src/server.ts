import http from "node:http";
import { CONFIG } from "./config";
import logger from "./utils/logger";
import app from "./app";
import connectDb from "./db/connectDb";

const startServer = async () => {
  try {
    const PORT = CONFIG.PORT;

    const server = http.createServer(app);

    await connectDb();

    server.listen(PORT, () => {
      logger.info(`server listening on port ${PORT}`);
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
  }
};

void startServer();
