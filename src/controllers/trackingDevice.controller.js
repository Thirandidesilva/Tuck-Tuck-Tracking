const { TrackingDevice } = require("../models");
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

const createTrackingDevice = async (req, res) => {
  try {
    const body = await getRequestBody(req);
    const {
      device_serial_number,
      sim_number,
      manufacturer,
      model,
      installation_date,
      status
    } = body;

    if (!device_serial_number || !sim_number || !manufacturer || !model) {
      return sendJson(res, 400, {
        success: false,
        message: "device_serial_number, sim_number, manufacturer, and model are required"
      });
    }

    const existingSerial = await TrackingDevice.findOne({
      where: { device_serial_number }
    });

    if (existingSerial) {
      return sendJson(res, 409, {
        success: false,
        message: "Device serial number already exists"
      });
    }

    const existingSIM = await TrackingDevice.findOne({
      where: { sim_number }
    });

    if (existingSIM) {
      return sendJson(res, 409, {
        success: false,
        message: "SIM number already exists"
      });
    }

    const newTrackingDevice = await TrackingDevice.create({
      device_serial_number,
      sim_number,
      manufacturer,
      model,
      installation_date,
      status: status || "ACTIVE"
    });

    return sendJson(res, 201, {
      success: true,
      message: "Tracking device created successfully",
      data: newTrackingDevice
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to create tracking device",
      error: error.message
    });
  }
};

const getAllTrackingDevices = async (req, res, query) => {
  try {
    const whereClause = {};

    if (query.status) {
      whereClause.status = query.status;
    }

    if (query.manufacturer) {
      whereClause.manufacturer = query.manufacturer;
    }

    const trackingDevices = await TrackingDevice.findAll({
      where: whereClause,
      order: [["device_id", "ASC"]]
    });

    return sendJson(res, 200, {
      success: true,
      message: "Tracking devices fetched successfully",
      count: trackingDevices.length,
      data: trackingDevices
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch tracking devices",
      error: error.message
    });
  }
};

const getTrackingDeviceById = async (req, res, deviceId) => {
  try {
    const trackingDevice = await TrackingDevice.findByPk(deviceId);

    if (!trackingDevice) {
      return sendJson(res, 404, {
        success: false,
        message: "Tracking device not found"
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: "Tracking device fetched successfully",
      data: trackingDevice
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch tracking device",
      error: error.message
    });
  }
};

const updateTrackingDevice = async (req, res, deviceId) => {
  try {
    const body = await getRequestBody(req);
    const {
      device_serial_number,
      sim_number,
      manufacturer,
      model,
      installation_date,
      status
    } = body;

    const trackingDevice = await TrackingDevice.findByPk(deviceId);

    if (!trackingDevice) {
      return sendJson(res, 404, {
        success: false,
        message: "Tracking device not found"
      });
    }

    if (device_serial_number && device_serial_number !== trackingDevice.device_serial_number) {
      const existingSerial = await TrackingDevice.findOne({
        where: { device_serial_number }
      });

      if (existingSerial) {
        return sendJson(res, 409, {
          success: false,
          message: "Device serial number already exists"
        });
      }
    }

    if (sim_number && sim_number !== trackingDevice.sim_number) {
      const existingSIM = await TrackingDevice.findOne({
        where: { sim_number }
      });

      if (existingSIM) {
        return sendJson(res, 409, {
          success: false,
          message: "SIM number already exists"
        });
      }
    }

    await trackingDevice.update({
      device_serial_number: device_serial_number ?? trackingDevice.device_serial_number,
      sim_number: sim_number ?? trackingDevice.sim_number,
      manufacturer: manufacturer ?? trackingDevice.manufacturer,
      model: model ?? trackingDevice.model,
      installation_date: installation_date ?? trackingDevice.installation_date,
      status: status ?? trackingDevice.status
    });

    return sendJson(res, 200, {
      success: true,
      message: "Tracking device updated successfully",
      data: trackingDevice
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to update tracking device",
      error: error.message
    });
  }
};

const updateTrackingDeviceStatus = async (req, res, deviceId) => {
  try {
    const body = await getRequestBody(req);
    const { status } = body;

    if (!status) {
      return sendJson(res, 400, {
        success: false,
        message: "status is required"
      });
    }

    const allowedStatuses = ["ACTIVE", "INACTIVE", "FAULTY", "MAINTENANCE"];

    if (!allowedStatuses.includes(status)) {
      return sendJson(res, 400, {
        success: false,
        message: "Invalid status. Allowed values: ACTIVE, INACTIVE, FAULTY, MAINTENANCE"
      });
    }

    const trackingDevice = await TrackingDevice.findByPk(deviceId);

    if (!trackingDevice) {
      return sendJson(res, 404, {
        success: false,
        message: "Tracking device not found"
      });
    }

    await trackingDevice.update({ status });

    return sendJson(res, 200, {
      success: true,
      message: "Tracking device status updated successfully",
      data: trackingDevice
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to update tracking device status",
      error: error.message
    });
  }
};

module.exports = {
  createTrackingDevice,
  getAllTrackingDevices,
  getTrackingDeviceById,
  updateTrackingDevice,
  updateTrackingDeviceStatus
};