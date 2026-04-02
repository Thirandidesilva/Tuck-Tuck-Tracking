const handleRoutes = require("./routes");
const parseUrl = require("./utils/parseUrl");
const sendJson = require("./utils/sendJson");

const app = async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Content-Type", "application/json");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }

    const { pathname, query } = parseUrl(req);

    if (req.method === "GET" && pathname === "/") {
      return sendJson(res, 200, {
        success: true,
        message: "API is running"
      });
    }

    if (req.method === "GET" && pathname === "/health") {
      return sendJson(res, 200, {
        success: true,
        status: "OK"
      });
    }

    return await handleRoutes(req, res, pathname, query);
  } catch (error) {
    console.error("App error:", error);
    return sendJson(res, 500, {
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = app;