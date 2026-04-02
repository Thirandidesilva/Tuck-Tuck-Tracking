const {
  getAllPoliceStations,
  getPoliceStationById,
  createPoliceStation,
  updatePoliceStation,
  deletePoliceStation
} = require("../controllers/policeStation.controller");

const policeStationRoutes = async (req, res, pathname, query) => {
  if (req.method === "GET" && pathname === "/api/v1/police-stations") {
    return getAllPoliceStations(req, res, query);
  }

  if (req.method === "POST" && pathname === "/api/v1/police-stations") {
    return createPoliceStation(req, res);
  }

  const stationMatch = pathname.match(/^\/api\/v1\/police-stations\/(\d+)$/);

  if (stationMatch) {
    const stationId = stationMatch[1];

    if (req.method === "GET") {
      return getPoliceStationById(req, res, stationId);
    }

    if (req.method === "PATCH") {
      return updatePoliceStation(req, res, stationId);
    }

    if (req.method === "DELETE") {
      return deletePoliceStation(req, res, stationId);
    }
  }

  return false;
};

module.exports = policeStationRoutes;