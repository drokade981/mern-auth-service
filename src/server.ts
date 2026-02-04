import { Config } from "./config/index";
import app from "./app";
import logger from "./config/logger";

function getPort(): number {
  const port = Config.PORT ? parseInt(Config.PORT, 10) : 3000;
  return isNaN(port) ? 3000 : port;
}

const startServer = () => {
  const port = getPort();
  try {
    app.listen(port, () => {
      logger.error("testing error log");
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
