const { Vehicle } = require("../models");
const sendJson = require("../utils/sendJson");
const { authorizeRoles } = require("../middleware/role.middleware");

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

const createVehicle = async (req, res) => {
  try {
    const authResult = authorizeRoles(req, [
      "HQ_ADMIN",
      "SYSTEM_ADMIN",
      "PROVINCIAL_OFFICER",
    ]);

    if (!authResult.success) {
      return sendJson(res, authResult.statusCode, {
        success: false,
        message: authResult.message,
      });
    }

    const body = await getRequestBody(req);
    const {
      registration_number,
      vehicle_type,
      model,
      color,
      year_of_manufacture,
      chassis_number,
      engine_number,
      status
    } = body;

    if (!registration_number || !vehicle_type || !model || !chassis_number || !engine_number) {
      return sendJson(res, 400, {
        success: false,
        message: "registration_number, vehicle_type, model, chassis_number, and engine_number are required"
      });
    }

    const existingRegistration = await Vehicle.findOne({
      where: { registration_number }
    });

    if (existingRegistration) {
      return sendJson(res, 409, {
        success: false,
        message: "Registration number already exists"
      });
    }

    const existingChassis = await Vehicle.findOne({
      where: { chassis_number }
    });

    if (existingChassis) {
      return sendJson(res, 409, {
        success: false,
        message: "Chassis number already exists"
      });
    }

    const existingEngine = await Vehicle.findOne({
      where: { engine_number }
    });

    if (existingEngine) {
      return sendJson(res, 409, {
        success: false,
        message: "Engine number already exists"
      });
    }

    const newVehicle = await Vehicle.create({
      registration_number,
      vehicle_type,
      model,
      color,
      year_of_manufacture,
      chassis_number,
      engine_number,
      status: status || "ACTIVE"
    });

    return sendJson(res, 201, {
      success: true,
      message: "Vehicle created successfully",
      data: newVehicle
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to create vehicle",
      error: error.message
    });
  }
};

const getAllVehicles = async (req, res, query) => {
  try {
    const authResult = authorizeRoles(req, [
      "HQ_ADMIN",
      "SYSTEM_ADMIN",
      "PROVINCIAL_OFFICER",
      "STATION_OFFICER",
    ]);

    if (!authResult.success) {
      return sendJson(res, authResult.statusCode, {
        success: false,
        message: authResult.message,
      });
    }

    const whereClause = {};

    if (query.status) {
      whereClause.status = query.status;
    }

    if (query.vehicle_type) {
      whereClause.vehicle_type = query.vehicle_type;
    }

    const vehicles = await Vehicle.findAll({
      where: whereClause,
      order: [["vehicle_id", "ASC"]]
    });

    return sendJson(res, 200, {
      success: true,
      message: "Vehicles fetched successfully",
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch vehicles",
      error: error.message
    });
  }
};

const getVehicleById = async (req, res, vehicleId) => {
  try {
    const authResult = authorizeRoles(req, [
      "HQ_ADMIN",
      "SYSTEM_ADMIN",
      "PROVINCIAL_OFFICER",
      "STATION_OFFICER",
    ]);

    if (!authResult.success) {
      return sendJson(res, authResult.statusCode, {
        success: false,
        message: authResult.message,
      });
    }

    const vehicle = await Vehicle.findByPk(vehicleId);

    if (!vehicle) {
      return sendJson(res, 404, {
        success: false,
        message: "Vehicle not found"
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: "Vehicle fetched successfully",
      data: vehicle
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch vehicle",
      error: error.message
    });
  }
};

const updateVehicle = async (req, res, vehicleId) => {
  try {
    const authResult = authorizeRoles(req, [
      "HQ_ADMIN",
      "SYSTEM_ADMIN",
      "PROVINCIAL_OFFICER",
    ]);

    if (!authResult.success) {
      return sendJson(res, authResult.statusCode, {
        success: false,
        message: authResult.message,
      });
    }

    const body = await getRequestBody(req);
    const {
      registration_number,
      vehicle_type,
      model,
      color,
      year_of_manufacture,
      chassis_number,
      engine_number,
      status
    } = body;

    const vehicle = await Vehicle.findByPk(vehicleId);

    if (!vehicle) {
      return sendJson(res, 404, {
        success: false,
        message: "Vehicle not found"
      });
    }

    if (registration_number && registration_number !== vehicle.registration_number) {
      const existingRegistration = await Vehicle.findOne({
        where: { registration_number }
      });

      if (existingRegistration) {
        return sendJson(res, 409, {
          success: false,
          message: "Registration number already exists"
        });
      }
    }

    if (chassis_number && chassis_number !== vehicle.chassis_number) {
      const existingChassis = await Vehicle.findOne({
        where: { chassis_number }
      });

      if (existingChassis) {
        return sendJson(res, 409, {
          success: false,
          message: "Chassis number already exists"
        });
      }
    }

    if (engine_number && engine_number !== vehicle.engine_number) {
      const existingEngine = await Vehicle.findOne({
        where: { engine_number }
      });

      if (existingEngine) {
        return sendJson(res, 409, {
          success: false,
          message: "Engine number already exists"
        });
      }
    }

    await vehicle.update({
      registration_number: registration_number ?? vehicle.registration_number,
      vehicle_type: vehicle_type ?? vehicle.vehicle_type,
      model: model ?? vehicle.model,
      color: color ?? vehicle.color,
      year_of_manufacture: year_of_manufacture ?? vehicle.year_of_manufacture,
      chassis_number: chassis_number ?? vehicle.chassis_number,
      engine_number: engine_number ?? vehicle.engine_number,
      status: status ?? vehicle.status
    });

    return sendJson(res, 200, {
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to update vehicle",
      error: error.message
    });
  }
};

const updateVehicleStatus = async (req, res, vehicleId) => {
  try {
    const authResult = authorizeRoles(req, [
      "HQ_ADMIN",
      "SYSTEM_ADMIN",
      "PROVINCIAL_OFFICER",
    ]);

    if (!authResult.success) {
      return sendJson(res, authResult.statusCode, {
        success: false,
        message: authResult.message,
      });
    }

    const body = await getRequestBody(req);
    const { status } = body;

    if (!status) {
      return sendJson(res, 400, {
        success: false,
        message: "status is required"
      });
    }

    const allowedStatuses = ["ACTIVE", "INACTIVE", "UNDER_MAINTENANCE"];

    if (!allowedStatuses.includes(status)) {
      return sendJson(res, 400, {
        success: false,
        message: "Invalid status. Allowed values: ACTIVE, INACTIVE, UNDER_MAINTENANCE"
      });
    }

    const vehicle = await Vehicle.findByPk(vehicleId);

    if (!vehicle) {
      return sendJson(res, 404, {
        success: false,
        message: "Vehicle not found"
      });
    }

    await vehicle.update({ status });

    return sendJson(res, 200, {
      success: true,
      message: "Vehicle status updated successfully",
      data: vehicle
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to update vehicle status",
      error: error.message
    });
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  updateVehicleStatus
};