import { Config } from "./config/index";
import app from "./app";
import logger from "./config/logger";
import { AppDataSource } from "./config/data-source";

function getPort(): number {
  const port = Config.PORT ? parseInt(Config.PORT, 10) : 3000;
  return isNaN(port) ? 3000 : port;
}

const startServer = async () => {
  const port = getPort();
  try {
    await AppDataSource.initialize();
    logger.info("Database connected");
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
