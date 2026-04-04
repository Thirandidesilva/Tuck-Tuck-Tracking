const {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  updateDriverStatus
} = require("../controllers/driver.controller");

const driverRoutes = async (req, res, pathname, query) => {
  if (req.method === "POST" && pathname === "/api/v1/drivers") {
    return createDriver(req, res);
  }

  if (req.method === "GET" && pathname === "/api/v1/drivers") {
    return getAllDrivers(req, res, query);
  }

  const driverMatch = pathname.match(/^\/api\/v1\/drivers\/(\d+)$/);

  if (driverMatch) {
    const driverId = driverMatch[1];

    if (req.method === "GET") {
      return getDriverById(req, res, driverId);
    }

    if (req.method === "PATCH") {
      return updateDriver(req, res, driverId);
    }
  }

  const statusMatch = pathname.match(/^\/api\/v1\/drivers\/(\d+)\/status$/);

  if (statusMatch) {
    const driverId = statusMatch[1];

    if (req.method === "PATCH") {
      return updateDriverStatus(req, res, driverId);
    }
  }

  return false;
};

module.exports = driverRoutes;