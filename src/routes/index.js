const sendJson = require("../utils/sendJson");
const provinceRoutes = require("./province.routes");
const districtRoutes = require("./district.routes");
const policeStationRoutes = require("./policeStation.routes");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const driverRoutes = require("./driver.routes");
const vehicleRoutes = require("./vehicle.routes");

const handleRoutes = async (req, res, pathname, query) => {
  const provinceHandled = await provinceRoutes(req, res, pathname, query);
  if (provinceHandled !== false) return;

  const districtHandled = await districtRoutes(req, res, pathname, query);
  if (districtHandled !== false) return;

  const policeStationHandled = await policeStationRoutes(req, res, pathname, query);
  if (policeStationHandled !== false) return;

  const authHandled = await authRoutes(req, res, pathname, query);
  if (authHandled !== false) return;

  const userHandled = await userRoutes(req, res, pathname, query);
  if (userHandled !== false) return;

  const driverHandled = await driverRoutes(req, res, pathname, query);
  if (driverHandled !== false) return;

  const vehicleHandled = await vehicleRoutes(req, res, pathname, query);
  if (vehicleHandled !== false) return;

  return sendJson(res, 404, {
    success: false,
    message: "Route not found"
  });
};

module.exports = handleRoutes;