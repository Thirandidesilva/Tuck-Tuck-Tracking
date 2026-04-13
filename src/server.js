const http = require("http");
const app = require("./app");
const env = require("./config/env");
const db = require("./models");
const { connectDB } = require("./config/db");
const { startLocationPingJob } = require("./jobs/locationPingJob");

const startServer = async () => {
  try {
    await connectDB();

    // Sync all Sequelize models to the database
    await db.sequelize.sync({ force: false });
    console.log("Models synchronized successfully.");

    startLocationPingJob();

    const server = http.createServer(app);

    server.listen(env.port, () => {
      console.log(`Server is running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
  }
};

startServer();