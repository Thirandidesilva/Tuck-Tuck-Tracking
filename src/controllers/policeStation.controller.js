const db = require("../models");
const parseBody = require("../utils/parseBody");
const sendJson = require("../utils/sendJson");

const { PoliceStation, District, Province } = db;

const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(query.limit, 10) || 10, 1);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

const getStationSort = (query) => {
  const allowedSortFields = {
    stationId: "station_id",
    stationName: "station_name",
    stationCode: "station_code",
    station_id: "station_id",
    station_name: "station_name",
    station_code: "station_code"
  };

  const sortBy = allowedSortFields[query.sortBy] || "station_name";
  const order = String(query.order || "ASC").toUpperCase() === "DESC" ? "DESC" : "ASC";

  return { sortBy, order };
};

const getAllPoliceStations = async (req, res, query) => {
  try {
    const districtId = query.districtId || query.district_id;
    const provinceId = query.provinceId || query.province_id;

    const stationWhere = {};
    const districtWhere = {};

    if (districtId) {
      stationWhere.district_id = districtId;
    }

    if (provinceId) {
      districtWhere.province_id = provinceId;
    }

    const { page, limit, offset } = getPagination(query);
    const { sortBy, order } = getStationSort(query);

    const { count, rows } = await PoliceStation.findAndCountAll({
      where: stationWhere,
      include: [
        {
          model: District,
          as: "district",
          where: Object.keys(districtWhere).length ? districtWhere : undefined,
          required: Boolean(provinceId),
          include: [
            {
              model: Province,
              as: "province"
            }
          ]
        }
      ],
      order: [[sortBy, order]],
      limit,
      offset,
      distinct: true
    });

    return sendJson(res, 200, {
      success: true,
      message: "Police stations retrieved successfully",
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit)
      },
      filters: {
        districtId: districtId || null,
        provinceId: provinceId || null
      },
      data: rows
    });
  } catch (error) {
    console.error("Error fetching police stations:", error);
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch police stations"
    });
  }
};

const getPoliceStationById = async (req, res, stationId) => {
  try {
    const station = await PoliceStation.findByPk(stationId, {
      include: [
        {
          model: District,
          as: "district",
          include: [
            {
              model: Province,
              as: "province"
            }
          ]
        }
      ]
    });

    if (!station) {
      return sendJson(res, 404, {
        success: false,
        message: "Police station not found"
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: "Police station retrieved successfully",
      data: station
    });
  } catch (error) {
    console.error("Error fetching police station:", error);
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch police station"
    });
  }
};

const createPoliceStation = async (req, res) => {
  try {
    const body = await parseBody(req);

    const stationName = body.stationName || body.station_name;
    const stationCode = body.stationCode || body.station_code;
    const districtId = body.districtId || body.district_id;
    const address = body.address;
    const contactNumber = body.contactNumber || body.contact_number;

    if (!stationName || !stationCode || !districtId) {
      return sendJson(res, 400, {
        success: false,
        message: "stationName, stationCode and districtId are required"
      });
    }

    const district = await District.findByPk(districtId);

    if (!district) {
      return sendJson(res, 404, {
        success: false,
        message: "Related district not found"
      });
    }

    const existingStation = await PoliceStation.findOne({
      where: { station_code: stationCode }
    });

    if (existingStation) {
      return sendJson(res, 409, {
        success: false,
        message: "Station code already exists"
      });
    }

    const station = await PoliceStation.create({
      station_name: stationName,
      station_code: stationCode,
      district_id: districtId,
      address: address || null,
      contact_number: contactNumber || null
    });

    return sendJson(res, 201, {
      success: true,
      message: "Police station created successfully",
      data: station
    });
  } catch (error) {
    console.error("Error creating police station:", error);

    if (error.message === "Invalid JSON body") {
      return sendJson(res, 400, {
        success: false,
        message: "Invalid JSON body"
      });
    }

    return sendJson(res, 500, {
      success: false,
      message: "Failed to create police station"
    });
  }
};

const updatePoliceStation = async (req, res, stationId) => {
  try {
    const station = await PoliceStation.findByPk(stationId);

    if (!station) {
      return sendJson(res, 404, {
        success: false,
        message: "Police station not found"
      });
    }

    const body = await parseBody(req);
    const updates = {};

    if (body.stationName || body.station_name) {
      updates.station_name = body.stationName || body.station_name;
    }

    if (body.stationCode || body.station_code) {
      const newCode = body.stationCode || body.station_code;

      const existingStation = await PoliceStation.findOne({
        where: { station_code: newCode }
      });

      if (existingStation && existingStation.station_id !== station.station_id) {
        return sendJson(res, 409, {
          success: false,
          message: "Station code already exists"
        });
      }

      updates.station_code = newCode;
    }

    if (body.districtId || body.district_id) {
      const districtId = body.districtId || body.district_id;
      const district = await District.findByPk(districtId);

      if (!district) {
        return sendJson(res, 404, {
          success: false,
          message: "Related district not found"
        });
      }

      updates.district_id = districtId;
    }

    if (body.address !== undefined) {
      updates.address = body.address;
    }

    if (body.contactNumber !== undefined || body.contact_number !== undefined) {
      updates.contact_number = body.contactNumber || body.contact_number || null;
    }

    if (Object.keys(updates).length === 0) {
      return sendJson(res, 400, {
        success: false,
        message: "At least one field is required to update"
      });
    }

    await station.update(updates);

    return sendJson(res, 200, {
      success: true,
      message: "Police station updated successfully",
      data: station
    });
  } catch (error) {
    console.error("Error updating police station:", error);

    if (error.message === "Invalid JSON body") {
      return sendJson(res, 400, {
        success: false,
        message: "Invalid JSON body"
      });
    }

    return sendJson(res, 500, {
      success: false,
      message: "Failed to update police station"
    });
  }
};

const deletePoliceStation = async (req, res, stationId) => {
  try {
    const station = await PoliceStation.findByPk(stationId);

    if (!station) {
      return sendJson(res, 404, {
        success: false,
        message: "Police station not found"
      });
    }

    await station.destroy();

    return sendJson(res, 200, {
      success: true,
      message: "Police station deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting police station:", error);
    return sendJson(res, 500, {
      success: false,
      message: "Failed to delete police station"
    });
  }
};

module.exports = {
  getAllPoliceStations,
  getPoliceStationById,
  createPoliceStation,
  updatePoliceStation,
  deletePoliceStation
};