const {
  getAllUsers,
  getUserById,
  updateUserStatus,
} = require("../controllers/user.controller");

const userRoutes = async (req, res, pathname, query) => {
  if (req.method === "GET" && pathname === "/api/v1/users") {
    return getAllUsers(req, res, query);
  }

  const userMatch = pathname.match(/^\/api\/v1\/users\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/);

  if (userMatch) {
    const userId = userMatch[1];

    if (req.method === "GET") {
      return getUserById(req, res, userId);
    }
  }

  const statusMatch = pathname.match(/^\/api\/v1\/users\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/status$/);

  if (statusMatch) {
    const userId = statusMatch[1];

    if (req.method === "PATCH") {
      return updateUserStatus(req, res, userId);
    }
  }

  return false;
};

module.exports = userRoutes;
