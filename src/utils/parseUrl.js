const { URL } = require("url");

const parseUrl = (req) => {
  const baseUrl = `http://${req.headers.host || "localhost:3000"}`;
  const parsedUrl = new URL(req.url, baseUrl);

  return {
    pathname: parsedUrl.pathname,
    query: Object.fromEntries(parsedUrl.searchParams.entries())
  };
};

module.exports = parseUrl;

