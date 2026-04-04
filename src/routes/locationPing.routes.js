const {
  createLocationPing,
  getAllLocationPings,
  getLocationPingById,
  getLocationPingsByVehicleId
} = require("../controllers/locationPing.controller");

const locationPingRoutes = async (req, res, pathname, query) => {
  if (req.method === "POST" && pathname === "/api/v1/location-pings") {
    return createLocationPing(req, res);
  }

  if (req.method === "GET" && pathname === "/api/v1/location-pings") {
    return getAllLocationPings(req, res, query);
  }

  const pingMatch = pathname.match(/^\/api\/v1\/location-pings\/(\d+)$/);

  if (pingMatch) {
    const pingId = pingMatch[1];

    if (req.method === "GET") {
      return getLocationPingById(req, res, pingId);
    }
  }

  const vehiclePingMatch = pathname.match(/^\/api\/v1\/vehicles\/(\d+)\/location-pings$/);

  if (vehiclePingMatch) {
    const vehicleId = vehiclePingMatch[1];

    if (req.method === "GET") {
      return getLocationPingsByVehicleId(req, res, vehicleId);
    }
  }

  return false;
};

module.exports = locationPingRoutes;