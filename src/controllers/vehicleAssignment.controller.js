const { VehicleAssignment, Driver, Vehicle, TrackingDevice } = require("../models");
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

const createVehicleAssignment = async (req, res) => {
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
      driver_id,
      vehicle_id,
      device_id,
      assigned_at,
      unassigned_at,
      status,
      notes
    } = body;

    if (!driver_id || !vehicle_id || !device_id) {
      return sendJson(res, 400, {
        success: false,
        message: "driver_id, vehicle_id, and device_id are required"
      });
    }

    const driver = await Driver.findByPk(driver_id);
    if (!driver) {
      return sendJson(res, 404, {
        success: false,
        message: "Driver not found"
      });
    }

    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle) {
      return sendJson(res, 404, {
        success: false,
        message: "Vehicle not found"
      });
    }

    const device = await TrackingDevice.findByPk(device_id);
    if (!device) {
      return sendJson(res, 404, {
        success: false,
        message: "Tracking device not found"
      });
    }

    const existingActiveDriverAssignment = await VehicleAssignment.findOne({
      where: {
        driver_id,
        status: "ACTIVE"
      }
    });

    if (existingActiveDriverAssignment) {
      return sendJson(res, 409, {
        success: false,
        message: "Driver already has an active assignment"
      });
    }

    const existingActiveVehicleAssignment = await VehicleAssignment.findOne({
      where: {
        vehicle_id,
        status: "ACTIVE"
      }
    });

    if (existingActiveVehicleAssignment) {
      return sendJson(res, 409, {
        success: false,
        message: "Vehicle already has an active assignment"
      });
    }

    const existingActiveDeviceAssignment = await VehicleAssignment.findOne({
      where: {
        device_id,
        status: "ACTIVE"
      }
    });

    if (existingActiveDeviceAssignment) {
      return sendJson(res, 409, {
        success: false,
        message: "Tracking device already has an active assignment"
      });
    }

    const newAssignment = await VehicleAssignment.create({
      driver_id,
      vehicle_id,
      device_id,
      assigned_at: assigned_at || new Date(),
      unassigned_at: unassigned_at || null,
      status: status || "ACTIVE",
      notes
    });

    return sendJson(res, 201, {
      success: true,
      message: "Vehicle assignment created successfully",
      data: newAssignment
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to create vehicle assignment",
      error: error.message
    });
  }
};

const getAllVehicleAssignments = async (req, res, query) => {
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

    const assignments = await VehicleAssignment.findAll({
      where: whereClause,
      include: [
        {
          model: Driver,
          as: "driver",
          attributes: ["driver_id", "full_name", "nic", "license_number"]
        },
        {
          model: Vehicle,
          as: "vehicle",
          attributes: ["vehicle_id", "registration_number", "vehicle_type", "model"]
        },
        {
          model: TrackingDevice,
          as: "device",
          attributes: ["device_id", "device_serial_number", "sim_number", "manufacturer", "model"]
        }
      ],
      order: [["assignment_id", "ASC"]]
    });

    return sendJson(res, 200, {
      success: true,
      message: "Vehicle assignments fetched successfully",
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch vehicle assignments",
      error: error.message
    });
  }
};

const getVehicleAssignmentById = async (req, res, assignmentId) => {
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

    const assignment = await VehicleAssignment.findByPk(assignmentId, {
      include: [
        {
          model: Driver,
          as: "driver",
          attributes: ["driver_id", "full_name", "nic", "license_number", "phone_number"]
        },
        {
          model: Vehicle,
          as: "vehicle",
          attributes: ["vehicle_id", "registration_number", "vehicle_type", "model", "color"]
        },
        {
          model: TrackingDevice,
          as: "device",
          attributes: ["device_id", "device_serial_number", "sim_number", "manufacturer", "model", "status"]
        }
      ]
    });

    if (!assignment) {
      return sendJson(res, 404, {
        success: false,
        message: "Vehicle assignment not found"
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: "Vehicle assignment fetched successfully",
      data: assignment
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch vehicle assignment",
      error: error.message
    });
  }
};

const updateVehicleAssignment = async (req, res, assignmentId) => {
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
      assigned_at,
      unassigned_at,
      status,
      notes
    } = body;

    const assignment = await VehicleAssignment.findByPk(assignmentId);

    if (!assignment) {
      return sendJson(res, 404, {
        success: false,
        message: "Vehicle assignment not found"
      });
    }

    await assignment.update({
      assigned_at: assigned_at ?? assignment.assigned_at,
      unassigned_at: unassigned_at ?? assignment.unassigned_at,
      status: status ?? assignment.status,
      notes: notes ?? assignment.notes
    });

    return sendJson(res, 200, {
      success: true,
      message: "Vehicle assignment updated successfully",
      data: assignment
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to update vehicle assignment",
      error: error.message
    });
  }
};

const updateVehicleAssignmentStatus = async (req, res, assignmentId) => {
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
    const { status, unassigned_at } = body;

    if (!status) {
      return sendJson(res, 400, {
        success: false,
        message: "status is required"
      });
    }

    const allowedStatuses = ["ACTIVE", "COMPLETED", "CANCELLED"];

    if (!allowedStatuses.includes(status)) {
      return sendJson(res, 400, {
        success: false,
        message: "Invalid status. Allowed values: ACTIVE, COMPLETED, CANCELLED"
      });
    }

    const assignment = await VehicleAssignment.findByPk(assignmentId);

    if (!assignment) {
      return sendJson(res, 404, {
        success: false,
        message: "Vehicle assignment not found"
      });
    }

    await assignment.update({
      status,
      unassigned_at: status === "ACTIVE" ? null : (unassigned_at || new Date())
    });

    return sendJson(res, 200, {
      success: true,
      message: "Vehicle assignment status updated successfully",
      data: assignment
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to update vehicle assignment status",
      error: error.message
    });
  }
};

module.exports = {
  createVehicleAssignment,
  getAllVehicleAssignments,
  getVehicleAssignmentById,
  updateVehicleAssignment,
  updateVehicleAssignmentStatus
};
