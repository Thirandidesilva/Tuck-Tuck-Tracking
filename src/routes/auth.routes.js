const {
  registerUser,
  loginUser,
  getMyProfile,
} = require("../controllers/auth.controller");

const authRoutes = async (req, res, pathname) => {
  if (req.method === "POST" && pathname === "/api/v1/auth/register") {
    return registerUser(req, res);
  }

  if (req.method === "POST" && pathname === "/api/v1/auth/login") {
    return loginUser(req, res);
  }

  if (req.method === "GET" && pathname === "/api/v1/auth/me") {
    return getMyProfile(req, res);
  }

  return false;
};

module.exports = authRoutes;