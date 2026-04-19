const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: process.env.DB_PORT || 5432,
  dbName: process.env.DB_NAME || "tuktuk_tracking_db",
  dbUser: process.env.DB_USER || "postgres",
  dbPassword: String(process.env.DB_PASSWORD || ""),
  dbDialect: process.env.DB_DIALECT || "postgres", 
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
};