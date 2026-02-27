import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from ".";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: Config.DB_HOST,
  port: Number(Config.DB_PORT),
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
  database: Config.DB_NAME,
  // don't use synchronize in production, it automatically creates database tables based on your entities and can drop existing tables if there are changes in the entity definitions. In production, it's recommended to use migrations to manage database schema changes safely.
  synchronize: false, //Config.NODE_ENV === "dev" || Config.NODE_ENV === "test", // only synchronize in development and test environments , false in production
  logging: false,
  entities: ["src/entity/*.ts"],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});
