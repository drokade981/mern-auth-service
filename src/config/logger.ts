import winston from "winston";
import { Config } from ".";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json(),
  ),

  defaultMeta: { service: "auth-service" },

  transports: [
    new winston.transports.File({
      dirname: "logs",
      filename: "combined.log",
      level: "info",
      silent: Config.NODE_ENV === "test",
    }),
    new winston.transports.File({
      level: "error",
      dirname: "logs",
      filename: "error.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      silent: Config.NODE_ENV === "production",
    }),
    new winston.transports.Console({
      level: "info",

      silent: Config.NODE_ENV === "production",
    }),
  ],
});

export default logger;
