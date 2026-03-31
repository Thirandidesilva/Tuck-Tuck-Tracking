const http = require("http");
const app = require("./app");
const env = require("./config/env");
const { connectDB } = require("./config/db");

const server = http.createServer(app);

const startServer = async () => {
  await connectDB();

  server.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
};

startServer();