const {
  LocationPing,
  VehicleAssignment,
  Driver,
  Vehicle,
  TrackingDevice,
  District,
  Province
} = require("../models");
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

// Checks if a ping's driver falls within the user's geographic scope.
// Requires ping to be loaded with assignment → driver → district already included.
const isPingInScope = (ping, scope) => {
  if (scope.type === "all") return true;
  const driver = ping.assignment?.driver;
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

const createLocationPing = async (req, res) => {
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

    // Load assignment with driver → district so we can validate geographic scope
    const assignment = await VehicleAssignment.findByPk(assignment_id, {
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

    if (assignment.status !== "ACTIVE") {
      return sendJson(res, 400, {
        success: false,
        message: "Location pings can only be added to an active assignment"
      });
    }

    // All roles can create pings but only within their geographic scope
    const scope = getGeoScope(authResult.user);
    if (!isPingInScope({ assignment }, scope)) {
      return sendJson(res, 403, {
        success: false,
        message: "You do not have access to this assignment"
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
    if (query.assignment_id) {
      whereClause.assignment_id = query.assignment_id;
    }

    // Base driver include — scope is applied to this and then nested inside assignment
    const baseDriverInclude = {
      model: Driver,
      as: "driver",
      attributes: ["driver_id", "full_name", "district_id"]
    };

    const scopedDriverInclude = applyScopeToDriverInclude(effectiveScope, baseDriverInclude, db);

    const pings = await LocationPing.findAll({
      where: whereClause,
      include: [
        {
          model: VehicleAssignment,
          as: "assignment",
          attributes: ["assignment_id", "status", "assigned_at"],
          // required: true ensures the scope JOIN cascade eliminates out-of-scope pings
          required: effectiveScope.type !== "all",
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
    // Same pattern as the assignment controller — avoids the duplicate District alias
    // problem that would occur if we tried to combine display and filter includes.
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
              attributes: ["driver_id", "full_name", "nic", "district_id"],
              include: [
                {
                  model: District,
                  as: "district",
                  attributes: ["district_id", "district_name", "district_code"],
                  include: [
                    {
                      model: Province,
                      as: "province",
                      attributes: ["province_id", "province_name", "province_code"]
                    }
                  ]
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

    const scope = getGeoScope(authResult.user);
    if (!isPingInScope(ping, scope)) {
      return sendJson(res, 403, {
        success: false,
        message: "You do not have access to this location ping"
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

    const baseDriverInclude = {
      model: Driver,
      as: "driver",
      attributes: ["driver_id", "full_name", "district_id"]
    };

    const scopedDriverInclude = applyScopeToDriverInclude(jwtScope, baseDriverInclude, db);

    const pings = await LocationPing.findAll({
      include: [
        {
          model: VehicleAssignment,
          as: "assignment",
          where: { vehicle_id: vehicleId },
          attributes: ["assignment_id", "vehicle_id", "driver_id", "device_id", "status"],
          required: true,
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