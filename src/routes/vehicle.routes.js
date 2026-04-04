const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  updateVehicleStatus
} = require("../controllers/vehicle.controller");

const vehicleRoutes = async (req, res, pathname, query) => {
  if (req.method === "POST" && pathname === "/api/v1/vehicles") {
    return createVehicle(req, res);
  }

  if (req.method === "GET" && pathname === "/api/v1/vehicles") {
    return getAllVehicles(req, res, query);
  }

  const vehicleMatch = pathname.match(/^\/api\/v1\/vehicles\/(\d+)$/);

  if (vehicleMatch) {
    const vehicleId = vehicleMatch[1];

    if (req.method === "GET") {
      return getVehicleById(req, res, vehicleId);
    }

    if (req.method === "PATCH") {
      return updateVehicle(req, res, vehicleId);
    }
  }

  const statusMatch = pathname.match(/^\/api\/v1\/vehicles\/(\d+)\/status$/);

  if (statusMatch) {
    const vehicleId = statusMatch[1];

    if (req.method === "PATCH") {
      return updateVehicleStatus(req, res, vehicleId);
    }
  }

  return false;
};

module.exports = vehicleRoutes;