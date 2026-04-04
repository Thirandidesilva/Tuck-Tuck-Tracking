const { Driver } = require("../models");
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

const createDriver = async (req, res) => {
  try {
    const body = await getRequestBody(req);
    const {
      full_name,
      nic,
      license_number,
      phone_number,
      address,
      status
    } = body;

    if (!full_name || !nic || !license_number || !phone_number) {
      return sendJson(res, 400, {
        success: false,
        message: "full_name, nic, license_number, and phone_number are required"
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
      full_name,
      nic,
      license_number,
      phone_number,
      address,
      status: status || "ACTIVE"
    });

    return sendJson(res, 201, {
      success: true,
      message: "Driver created successfully",
      data: newDriver
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
    const whereClause = {};

    if (query.status) {
      whereClause.status = query.status;
    }

    const drivers = await Driver.findAll({
      where: whereClause,
      order: [["driver_id", "ASC"]]
    });

    return sendJson(res, 200, {
      success: true,
      message: "Drivers fetched successfully",
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch drivers",
      error: error.message
    });
  }
};

const getDriverById = async (req, res, driverId) => {
  try {
    const driver = await Driver.findByPk(driverId);

    if (!driver) {
      return sendJson(res, 404, {
        success: false,
        message: "Driver not found"
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
    const body = await getRequestBody(req);
    const {
      full_name,
      nic,
      license_number,
      phone_number,
      address,
      status
    } = body;

    const driver = await Driver.findByPk(driverId);

    if (!driver) {
      return sendJson(res, 404, {
        success: false,
        message: "Driver not found"
      });
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
      full_name: full_name ?? driver.full_name,
      nic: nic ?? driver.nic,
      license_number: license_number ?? driver.license_number,
      phone_number: phone_number ?? driver.phone_number,
      address: address ?? driver.address,
      status: status ?? driver.status
    });

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

    const driver = await Driver.findByPk(driverId);

    if (!driver) {
      return sendJson(res, 404, {
        success: false,
        message: "Driver not found"
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