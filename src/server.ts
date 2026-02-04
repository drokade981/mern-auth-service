import { Config } from "./config/index";
import app from "./app";

function getPort(): number {
  const port = Config.PORT ? parseInt(Config.PORT, 10) : 3000;
  return isNaN(port) ? 3000 : port;
}

const startServer = () => {
  const port = getPort();
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
     
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
