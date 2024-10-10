import { Sequelize } from "sequelize";

// Initialize Sequelize with SQLite
export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite", // Path to SQLite database
  logging: false, // Disable logging for cleaner output
});
