const { Driver, District, Province } = require("../models");
const db = require("../models");
const sendJson = require("../utils/sendJson");
const { authorizeRoles } = require("../middleware/role.middleware");
const { getGeoScope, buildDriverScope } = require("../middleware/scope.middleware");

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

// Include district province on driver responses
const districtDisplayInclude = {
  model: District,
  as: "district",
  attributes: ["district_id", "district_name", "district_code"],
  include: [
    {
      model: Province,
      as: "province",
      attributes: ["province_id", "province_name", "province_code"],
    },
  ],
};

// Returns true if the driver's district falls within the user's geographic scope
const isDriverInScope = (driver, scope) => {
  if (scope.type === "all") return true;
  if (scope.type === "district") return driver.district_id === scope.district_id;
  if (scope.type === "province") return driver.district?.province_id === scope.province_id;
  return false;
};

const createDriver = async (req, res) => {
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
      district_id,
      full_name,
      nic,
      license_number,
      phone_number,
      address,
      status
    } = body;

    if (!district_id || !full_name || !nic || !license_number || !phone_number) {
      return sendJson(res, 400, {
        success: false,
        message: "district_id, full_name, nic, license_number, and phone_number are required"
      });
    }

    const district = await District.findByPk(district_id);
    if (!district) {
      return sendJson(res, 404, {
        success: false,
        message: "District not found"
      });
    }

    // PROVINCIAL_OFFICER can only create drivers within their own province
    const scope = getGeoScope(authResult.user);
    if (scope.type === "province" && district.province_id !== scope.province_id) {
      return sendJson(res, 403, {
        success: false,
        message: "You can only create drivers within your province"
      });
    }

    const existingNIC = await Driver.findOne({ where: { nic } });
    if (existingNIC) {
      return sendJson(res, 409, {
        success: false,
        message: "NIC already exists"
      });
    }

    const existingLicense = await Driver.findOne({ where: { license_number } });
    if (existingLicense) {
      return sendJson(res, 409, {
        success: false,
        message: "License number already exists"
      });
    }

    const newDriver = await Driver.create({
      district_id,
      full_name,
      nic,
      license_number,
      phone_number,
      address,
      status: status || "ACTIVE"
    });

    // Return with district info
    const created = await Driver.findByPk(newDriver.driver_id, {
      include: [districtDisplayInclude]
    });

    return sendJson(res, 201, {
      success: true,
      message: "Driver created successfully",
      data: created
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to create driver",
      error: error.message
    });
  }
};

const getAllDrivers = async (req, res, query) => {
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

    const scope = getGeoScope(authResult.user);
    const { where: geoWhere, include: geoInclude } = buildDriverScope(scope, db);

    const whereClause = { ...geoWhere };

    if (query.status) {
      whereClause.status = query.status;
    }

    // Admins can filter down by district_id or province_id via query params.
    // Provincial officers can narrow further to a specific district.
    // Station officers are already pinned to their district — these params are ignored.
    if (scope.type !== "district") {
      if (query.district_id) {
        whereClause.district_id = parseInt(query.district_id);
      }

      // province_id query param: only makes sense for admins (province scope is already
      // handled by geoInclude for PROVINCIAL_OFFICER)
      if (query.province_id && scope.type === "all") {
        const provinceScope = { type: "province", province_id: parseInt(query.province_id) };
        const { include: provinceInclude } = buildDriverScope(provinceScope, db);
        return sendDriverList(res, whereClause, provinceInclude);
      }
    }

    const includes = geoInclude.length > 0 ? geoInclude : [districtDisplayInclude];

    return sendDriverList(res, whereClause, includes);
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch drivers",
      error: error.message
    });
  }
};

// Shared helper to execute the driver list query and send response
const sendDriverList = async (res, whereClause, includes) => {
  const drivers = await Driver.findAll({
    where: whereClause,
    include: includes,
    order: [["driver_id", "ASC"]]
  });

  return sendJson(res, 200, {
    success: true,
    message: "Drivers fetched successfully",
    count: drivers.length,
    data: drivers
  });
};

const getDriverById = async (req, res, driverId) => {
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

    const driver = await Driver.findByPk(driverId, {
      include: [districtDisplayInclude]
    });

    if (!driver) {
      return sendJson(res, 404, {
        success: false,
        message: "Driver not found"
      });
    }

    const scope = getGeoScope(authResult.user);
    if (!isDriverInScope(driver, scope)) {
      return sendJson(res, 403, {
        success: false,
        message: "You do not have access to this driver"
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: "Driver fetched successfully",
      data: driver
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch driver",
      error: error.message
    });
  }
};

const updateDriver = async (req, res, driverId) => {
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
      district_id,
      full_name,
      nic,
      license_number,
      phone_number,
      address,
      status
    } = body;

    const driver = await Driver.findByPk(driverId, {
      include: [districtDisplayInclude]
    });

    if (!driver) {
      return sendJson(res, 404, {
        success: false,
        message: "Driver not found"
      });
    }

    const scope = getGeoScope(authResult.user);

    // Scope check: can this user modify this driver at all?
    if (!isDriverInScope(driver, scope)) {
      return sendJson(res, 403, {
        success: false,
        message: "You do not have access to this driver"
      });
    }

    // If district is being reassigned, validate the target district is also in scope
    if (district_id !== undefined && district_id !== driver.district_id) {
      const newDistrict = await District.findByPk(district_id);
      if (!newDistrict) {
        return sendJson(res, 404, {
          success: false,
          message: "Target district not found"
        });
      }

      if (scope.type === "province" && newDistrict.province_id !== scope.province_id) {
        return sendJson(res, 403, {
          success: false,
          message: "You can only reassign drivers within your province"
        });
      }
    }

    if (nic && nic !== driver.nic) {
      const existingNIC = await Driver.findOne({ where: { nic } });
      if (existingNIC) {
        return sendJson(res, 409, {
          success: false,
          message: "NIC already exists"
        });
      }
    }

    if (license_number && license_number !== driver.license_number) {
      const existingLicense = await Driver.findOne({ where: { license_number } });
      if (existingLicense) {
        return sendJson(res, 409, {
          success: false,
          message: "License number already exists"
        });
      }
    }

    await driver.update({
      district_id: district_id ?? driver.district_id,
      full_name: full_name ?? driver.full_name,
      nic: nic ?? driver.nic,
      license_number: license_number ?? driver.license_number,
      phone_number: phone_number ?? driver.phone_number,
      address: address ?? driver.address,
      status: status ?? driver.status
    });

    // Reload with district info after update
    await driver.reload({ include: [districtDisplayInclude] });

    return sendJson(res, 200, {
      success: true,
      message: "Driver updated successfully",
      data: driver
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to update driver",
      error: error.message
    });
  }
};

const updateDriverStatus = async (req, res, driverId) => {
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

    const allowedStatuses = ["ACTIVE", "INACTIVE", "SUSPENDED"];
    if (!allowedStatuses.includes(status)) {
      return sendJson(res, 400, {
        success: false,
        message: "Invalid status. Allowed values: ACTIVE, INACTIVE, SUSPENDED"
      });
    }

    const driver = await Driver.findByPk(driverId, {
      include: [districtDisplayInclude]
    });

    if (!driver) {
      return sendJson(res, 404, {
        success: false,
        message: "Driver not found"
      });
    }

    const scope = getGeoScope(authResult.user);
    if (!isDriverInScope(driver, scope)) {
      return sendJson(res, 403, {
        success: false,
        message: "You do not have access to this driver"
      });
    }

    await driver.update({ status });

    return sendJson(res, 200, {
      success: true,
      message: "Driver status updated successfully",
      data: driver
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to update driver status",
      error: error.message
    });
  }
};

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  updateDriverStatus
};
