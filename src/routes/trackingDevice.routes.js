const {
  createTrackingDevice,
  getAllTrackingDevices,
  getTrackingDeviceById,
  updateTrackingDevice,
  updateTrackingDeviceStatus
} = require("../controllers/trackingDevice.controller");

const { getLocationPingsByDeviceId } = require("../controllers/locationPing.controller");

const trackingDeviceRoutes = async (req, res, pathname, query) => {
  if (req.method === "POST" && pathname === "/api/v1/tracking-devices") {
    return createTrackingDevice(req, res);
  }

  if (req.method === "GET" && pathname === "/api/v1/tracking-devices") {
    return getAllTrackingDevices(req, res, query);
  }

  const deviceMatch = pathname.match(/^\/api\/v1\/tracking-devices\/(\d+)$/);

  if (deviceMatch) {
    const deviceId = deviceMatch[1];

    if (req.method === "GET") {
      return getTrackingDeviceById(req, res, deviceId);
    }

    if (req.method === "PATCH") {
      return updateTrackingDevice(req, res, deviceId);
    }
  }

  const statusMatch = pathname.match(/^\/api\/v1\/tracking-devices\/(\d+)\/status$/);

  if (statusMatch) {
    const deviceId = statusMatch[1];

    if (req.method === "PATCH") {
      return updateTrackingDeviceStatus(req, res, deviceId);
    }
  }

  const pingMatch = pathname.match(/^\/api\/v1\/tracking-devices\/(\d+)\/location-pings$/);

  if (pingMatch) {
    const deviceId = pingMatch[1];

    if (req.method === "GET") {
      return getLocationPingsByDeviceId(req, res, deviceId);
    }
  }

  return false;
};

module.exports = trackingDeviceRoutes;