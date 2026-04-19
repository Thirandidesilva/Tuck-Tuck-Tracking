const fs = require("fs");
const path = require("path");
const swaggerUiDist = require("swagger-ui-dist");

const swaggerUiPath = swaggerUiDist.getAbsoluteFSPath();

const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  const contentTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".png": "image/png",
    ".json": "application/json",
    ".map": "application/json",
    ".svg": "image/svg+xml"
  };

  return contentTypes[ext] || "text/plain";
};

const getSwaggerHtml = () => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Sri Lanka Police Tuk-Tuk Tracking API Docs</title>
  <link rel="stylesheet" type="text/css" href="/api-docs/swagger-ui.css" />
  <link rel="icon" type="image/png" href="/api-docs/favicon-32x32.png" sizes="32x32" />
  <link rel="icon" type="image/png" href="/api-docs/favicon-16x16.png" sizes="16x16" />
  <style>
    html { box-sizing: border-box; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; background: #fafafa; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>

  <script src="/api-docs/swagger-ui-bundle.js"></script>
  <script src="/api-docs/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function () {
      window.ui = SwaggerUIBundle({
        url: "/swagger.yaml",
        dom_id: "#swagger-ui",
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>
  `;
};

const serveSwaggerUI = (req, res, pathname) => {
  if (pathname === "/api-docs" || pathname === "/api-docs/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(getSwaggerHtml());
    return true;
  }

  if (pathname === "/swagger.yaml") {
    const swaggerPath = path.join(process.cwd(), "swagger.yaml");

    fs.readFile(swaggerPath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
          success: false,
          message: "Failed to load swagger.yaml"
        }));
      }

      res.writeHead(200, { "Content-Type": "application/yaml" });
      res.end(data);
    });

    return true;
  }

  if (pathname.startsWith("/api-docs/")) {
    const assetPath = pathname.replace("/api-docs/", "");
    const fullPath = path.join(swaggerUiPath, assetPath);

    if (!fullPath.startsWith(swaggerUiPath)) {
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        success: false,
        message: "Forbidden"
      }));
    }

    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
          success: false,
          message: "Swagger asset not found"
        }));
      }

      res.writeHead(200, { "Content-Type": getContentType(fullPath) });
      res.end(data);
    });

    return true;
  }

  return false;
};

module.exports = {
  serveSwaggerUI
};