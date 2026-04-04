const { LocationPing, VehicleAssignment, Driver, Vehicle, TrackingDevice } = require("../models");
const sendJson = require("../utils/sendJson");

const getRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const parsedBody = body ? JSON.parse(body) : {};
        resolve(parsedBody);
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", (error) => {
      reject(error);
    });
  });
};

const createLocationPing = async (req, res) => {
  try {
    const body = await getRequestBody(req);
    const {
      assignment_id,
      latitude,
      longitude,
      speed,
      heading,
      recorded_at
    } = body;

    if (!assignment_id || latitude === undefined || longitude === undefined) {
      return sendJson(res, 400, {
        success: false,
        message: "assignment_id, latitude, and longitude are required"
      });
    }

    const assignment = await VehicleAssignment.findByPk(assignment_id);

    if (!assignment) {
      return sendJson(res, 404, {
        success: false,
        message: "Vehicle assignment not found"
      });
    }

    if (assignment.status !== "ACTIVE") {
      return sendJson(res, 400, {
        success: false,
        message: "Location pings can only be added to an active assignment"
      });
    }

    const newPing = await LocationPing.create({
      assignment_id,
      latitude,
      longitude,
      speed,
      heading,
      recorded_at: recorded_at || new Date()
    });

    return sendJson(res, 201, {
      success: true,
      message: "Location ping created successfully",
      data: newPing
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to create location ping",
      error: error.message
    });
  }
};

const getAllLocationPings = async (req, res, query) => {
  try {
    const whereClause = {};

    if (query.assignment_id) {
      whereClause.assignment_id = query.assignment_id;
    }

    const pings = await LocationPing.findAll({
      where: whereClause,
      include: [
        {
          model: VehicleAssignment,
          as: "assignment",
          attributes: ["assignment_id", "status", "assigned_at"],
          include: [
            {
              model: Driver,
              as: "driver",
              attributes: ["driver_id", "full_name"]
            },
            {
              model: Vehicle,
              as: "vehicle",
              attributes: ["vehicle_id", "registration_number", "vehicle_type", "model"]
            },
            {
              model: TrackingDevice,
              as: "device",
              attributes: ["device_id", "device_serial_number", "model"]
            }
          ]
        }
      ],
      order: [["ping_id", "DESC"]]
    });

    return sendJson(res, 200, {
      success: true,
      message: "Location pings fetched successfully",
      count: pings.length,
      data: pings
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch location pings",
      error: error.message
    });
  }
};

const getLocationPingById = async (req, res, pingId) => {
  try {
    const ping = await LocationPing.findByPk(pingId, {
      include: [
        {
          model: VehicleAssignment,
          as: "assignment",
          attributes: ["assignment_id", "status", "assigned_at", "unassigned_at"],
          include: [
            {
              model: Driver,
              as: "driver",
              attributes: ["driver_id", "full_name", "nic"]
            },
            {
              model: Vehicle,
              as: "vehicle",
              attributes: ["vehicle_id", "registration_number", "vehicle_type", "model", "color"]
            },
            {
              model: TrackingDevice,
              as: "device",
              attributes: ["device_id", "device_serial_number", "manufacturer", "model"]
            }
          ]
        }
      ]
    });

    if (!ping) {
      return sendJson(res, 404, {
        success: false,
        message: "Location ping not found"
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: "Location ping fetched successfully",
      data: ping
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch location ping",
      error: error.message
    });
  }
};

const getLocationPingsByVehicleId = async (req, res, vehicleId) => {
  try {
    const pings = await LocationPing.findAll({
      include: [
        {
          model: VehicleAssignment,
          as: "assignment",
          where: { vehicle_id: vehicleId },
          attributes: ["assignment_id", "vehicle_id", "driver_id", "device_id", "status"],
          include: [
            {
              model: Driver,
              as: "driver",
              attributes: ["driver_id", "full_name"]
            },
            {
              model: Vehicle,
              as: "vehicle",
              attributes: ["vehicle_id", "registration_number", "vehicle_type", "model"]
            },
            {
              model: TrackingDevice,
              as: "device",
              attributes: ["device_id", "device_serial_number", "model"]
            }
          ]
        }
      ],
      order: [["ping_id", "DESC"]]
    });

    return sendJson(res, 200, {
      success: true,
      message: "Vehicle location pings fetched successfully",
      count: pings.length,
      data: pings
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch vehicle location pings",
      error: error.message
    });
  }
};

module.exports = {
  createLocationPing,
  getAllLocationPings,
  getLocationPingById,
  getLocationPingsByVehicleId
};