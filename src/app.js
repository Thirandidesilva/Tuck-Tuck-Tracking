const app = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200);
    return res.end(JSON.stringify({ message: "API is running" }));
  }

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200);
    return res.end(JSON.stringify({ status: "OK" }));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ message: "Not found" }));
};

module.exports = app;