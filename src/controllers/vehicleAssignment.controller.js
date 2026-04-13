const { VehicleAssignment, Driver, Vehicle, TrackingDevice, District, Province } = require("../models");
const db = require("../models");
const sendJson = require("../utils/sendJson");
const { authorizeRoles } = require("../middleware/role.middleware");
const { getGeoScope, applyScopeToDriverInclude, validateScopeOverrides } = require("../middleware/scope.middleware");

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

// Checks if an assignment's driver falls within the user's geographic scope.
// Requires assignment to be loaded with driver → district already included.
const isAssignmentInScope = (assignment, scope) => {
  if (scope.type === "all") return true;
  const driver = assignment.driver;
  if (!driver) return false;
  if (scope.type === "district") return driver.district_id === scope.district_id;
  if (scope.type === "province") return driver.district?.province_id === scope.province_id;
  return false;
};

// Resolves effective scope from JWT scope + optional query param overrides.
// Admins can narrow by province_id or district_id. Provincial officers can narrow to a district.
const resolveEffectiveScope = (jwtScope, query) => {
  if (jwtScope.type === "all") {
    if (query.district_id) return { type: "district", district_id: parseInt(query.district_id) };
    if (query.province_id) return { type: "province", province_id: parseInt(query.province_id) };
  }
  if (jwtScope.type === "province" && query.district_id) {
    return { type: "district", district_id: parseInt(query.district_id), province_id: jwtScope.province_id };
  }
  return jwtScope;
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

    // Load driver with district so we can validate geographic scope
    const driver = await Driver.findByPk(driver_id, {
      include: [{ model: District, as: "district", attributes: ["district_id", "province_id"] }]
    });
    if (!driver) {
      return sendJson(res, 404, {
        success: false,
        message: "Driver not found"
      });
    }

    // PROVINCIAL_OFFICER can only assign drivers within their province
    const scope = getGeoScope(authResult.user);
    if (scope.type === "province" && driver.district?.province_id !== scope.province_id) {
      return sendJson(res, 403, {
        success: false,
        message: "You can only create assignments for drivers within your province"
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
      where: { driver_id, status: "ACTIVE" }
    });
    if (existingActiveDriverAssignment) {
      return sendJson(res, 409, {
        success: false,
        message: "Driver already has an active assignment"
      });
    }

    const existingActiveVehicleAssignment = await VehicleAssignment.findOne({
      where: { vehicle_id, status: "ACTIVE" }
    });
    if (existingActiveVehicleAssignment) {
      return sendJson(res, 409, {
        success: false,
        message: "Vehicle already has an active assignment"
      });
    }

    const existingActiveDeviceAssignment = await VehicleAssignment.findOne({
      where: { device_id, status: "ACTIVE" }
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

    // Return with full includes
    const created = await VehicleAssignment.findByPk(newAssignment.assignment_id, {
      include: [
        {
          model: Driver,
          as: "driver",
          attributes: ["driver_id", "full_name", "nic", "license_number", "district_id"],
          include: [
            {
              model: District,
              as: "district",
              attributes: ["district_id", "district_name", "district_code"],
              include: [{ model: Province, as: "province", attributes: ["province_id", "province_name", "province_code"] }]
            }
          ]
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
      ]
    });

    return sendJson(res, 201, {
      success: true,
      message: "Vehicle assignment created successfully",
      data: created
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

    const jwtScope = getGeoScope(authResult.user);

    const scopeError = await validateScopeOverrides(jwtScope, query, db);
    if (scopeError) {
      return sendJson(res, scopeError.statusCode, { success: false, message: scopeError.message });
    }

    const effectiveScope = resolveEffectiveScope(jwtScope, query);

    const whereClause = {};
    if (query.status) {
      whereClause.status = query.status;
    }

    // Base driver include — district_id is a direct field on driver so it's always present.
    // applyScopeToDriverInclude adds the required JOIN and where conditions for filtering.
    // For province scope it also adds a District sub-include (district name visible in response).
    const baseDriverInclude = {
      model: Driver,
      as: "driver",
      attributes: ["driver_id", "full_name", "nic", "license_number", "district_id"]
    };

    const scopedDriverInclude = applyScopeToDriverInclude(effectiveScope, baseDriverInclude, db);

    const assignments = await VehicleAssignment.findAll({
      where: whereClause,
      include: [
        scopedDriverInclude,
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
      order: [["created_at", "ASC"]]
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

    // Fetch first with full display includes, then scope-check on loaded data.
    // Avoids the duplicate-alias conflict that would occur if we tried to merge
    // a display District include and a filtering District include on the same driver.
    const assignment = await VehicleAssignment.findByPk(assignmentId, {
      include: [
        {
          model: Driver,
          as: "driver",
          attributes: ["driver_id", "full_name", "nic", "license_number", "phone_number", "district_id"],
          include: [
            {
              model: District,
              as: "district",
              attributes: ["district_id", "district_name", "district_code"],
              include: [{ model: Province, as: "province", attributes: ["province_id", "province_name", "province_code"] }]
            }
          ]
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

    const scope = getGeoScope(authResult.user);
    if (!isAssignmentInScope(assignment, scope)) {
      return sendJson(res, 403, {
        success: false,
        message: "You do not have access to this assignment"
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
    const { assigned_at, unassigned_at, status, notes } = body;

    const assignment = await VehicleAssignment.findByPk(assignmentId, {
      include: [
        {
          model: Driver,
          as: "driver",
          attributes: ["driver_id", "district_id"],
          include: [{ model: District, as: "district", attributes: ["district_id", "province_id"] }]
        }
      ]
    });

    if (!assignment) {
      return sendJson(res, 404, {
        success: false,
        message: "Vehicle assignment not found"
      });
    }

    const scope = getGeoScope(authResult.user);
    if (!isAssignmentInScope(assignment, scope)) {
      return sendJson(res, 403, {
        success: false,
        message: "You do not have access to this assignment"
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

    const assignment = await VehicleAssignment.findByPk(assignmentId, {
      include: [
        {
          model: Driver,
          as: "driver",
          attributes: ["driver_id", "district_id"],
          include: [{ model: District, as: "district", attributes: ["district_id", "province_id"] }]
        }
      ]
    });

    if (!assignment) {
      return sendJson(res, 404, {
        success: false,
        message: "Vehicle assignment not found"
      });
    }

    const scope = getGeoScope(authResult.user);
    if (!isAssignmentInScope(assignment, scope)) {
      return sendJson(res, 403, {
        success: false,
        message: "You do not have access to this assignment"
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