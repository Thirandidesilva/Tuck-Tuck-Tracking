const http = require("http");
const app = require("./app");
const env = require("./config/env");
const { connectDB } = require("./config/db");
const db = require("./models");

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();

    await db.sequelize.sync({ alter: true });
    console.log("Tables synced successfully");

    server.listen(env.port, () => {
      console.log(`Server is running on port ${env.port}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

startServer();