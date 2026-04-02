const db = require("../models");
const parseBody = require("../utils/parseBody");
const sendJson = require("../utils/sendJson");

const { District, Province } = db;

const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(query.limit, 10) || 10, 1);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

const getDistrictSort = (query) => {
  const allowedSortFields = {
    districtId: "district_id",
    districtName: "district_name",
    districtCode: "district_code",
    district_id: "district_id",
    district_name: "district_name",
    district_code: "district_code"
  };

  const sortBy = allowedSortFields[query.sortBy] || "district_name";
  const order = String(query.order || "ASC").toUpperCase() === "DESC" ? "DESC" : "ASC";

  return { sortBy, order };
};

const getAllDistricts = async (req, res, query) => {
  try {
    const where = {};
    const provinceId = query.provinceId || query.province_id;

    if (provinceId) {
      where.province_id = provinceId;
    }

    const { page, limit, offset } = getPagination(query);
    const { sortBy, order } = getDistrictSort(query);

    const { count, rows } = await District.findAndCountAll({
      where,
      include: [
        {
          model: Province,
          as: "province"
        }
      ],
      order: [[sortBy, order]],
      limit,
      offset
    });

    return sendJson(res, 200, {
      success: true,
      message: "Districts retrieved successfully",
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit)
      },
      filters: {
        provinceId: provinceId || null
      },
      data: rows
    });
  } catch (error) {
    console.error("Error fetching districts:", error);
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch districts"
    });
  }
};

const getDistrictById = async (req, res, districtId) => {
  try {
    const district = await District.findByPk(districtId, {
      include: [
        {
          model: Province,
          as: "province"
        }
      ]
    });

    if (!district) {
      return sendJson(res, 404, {
        success: false,
        message: "District not found"
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: "District retrieved successfully",
      data: district
    });
  } catch (error) {
    console.error("Error fetching district:", error);
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch district"
    });
  }
};

const createDistrict = async (req, res) => {
  try {
    const body = await parseBody(req);

    const districtName = body.districtName || body.district_name;
    const districtCode = body.districtCode || body.district_code;
    const provinceId = body.provinceId || body.province_id;

    if (!districtName || !districtCode || !provinceId) {
      return sendJson(res, 400, {
        success: false,
        message: "districtName, districtCode and provinceId are required"
      });
    }

    const province = await Province.findByPk(provinceId);

    if (!province) {
      return sendJson(res, 404, {
        success: false,
        message: "Related province not found"
      });
    }

    const existingDistrict = await District.findOne({
      where: { district_code: districtCode }
    });

    if (existingDistrict) {
      return sendJson(res, 409, {
        success: false,
        message: "District code already exists"
      });
    }

    const district = await District.create({
      district_name: districtName,
      district_code: districtCode,
      province_id: provinceId
    });

    return sendJson(res, 201, {
      success: true,
      message: "District created successfully",
      data: district
    });
  } catch (error) {
    console.error("Error creating district:", error);

    if (error.message === "Invalid JSON body") {
      return sendJson(res, 400, {
        success: false,
        message: "Invalid JSON body"
      });
    }

    return sendJson(res, 500, {
      success: false,
      message: "Failed to create district"
    });
  }
};

const updateDistrict = async (req, res, districtId) => {
  try {
    const district = await District.findByPk(districtId);

    if (!district) {
      return sendJson(res, 404, {
        success: false,
        message: "District not found"
      });
    }

    const body = await parseBody(req);
    const updates = {};

    if (body.districtName || body.district_name) {
      updates.district_name = body.districtName || body.district_name;
    }

    if (body.districtCode || body.district_code) {
      const newCode = body.districtCode || body.district_code;

      const existingDistrict = await District.findOne({
        where: { district_code: newCode }
      });

      if (existingDistrict && existingDistrict.district_id !== district.district_id) {
        return sendJson(res, 409, {
          success: false,
          message: "District code already exists"
        });
      }

      updates.district_code = newCode;
    }

    if (body.provinceId || body.province_id) {
      const provinceId = body.provinceId || body.province_id;
      const province = await Province.findByPk(provinceId);

      if (!province) {
        return sendJson(res, 404, {
          success: false,
          message: "Related province not found"
        });
      }

      updates.province_id = provinceId;
    }

    if (Object.keys(updates).length === 0) {
      return sendJson(res, 400, {
        success: false,
        message: "At least one field is required to update"
      });
    }

    await district.update(updates);

    return sendJson(res, 200, {
      success: true,
      message: "District updated successfully",
      data: district
    });
  } catch (error) {
    console.error("Error updating district:", error);

    if (error.message === "Invalid JSON body") {
      return sendJson(res, 400, {
        success: false,
        message: "Invalid JSON body"
      });
    }

    return sendJson(res, 500, {
      success: false,
      message: "Failed to update district"
    });
  }
};

const deleteDistrict = async (req, res, districtId) => {
  try {
    const district = await District.findByPk(districtId);

    if (!district) {
      return sendJson(res, 404, {
        success: false,
        message: "District not found"
      });
    }

    await district.destroy();

    return sendJson(res, 200, {
      success: true,
      message: "District deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting district:", error);
    return sendJson(res, 500, {
      success: false,
      message: "Failed to delete district. It may be linked to police stations."
    });
  }
};

module.exports = {
  getAllDistricts,
  getDistrictById,
  createDistrict,
  updateDistrict,
  deleteDistrict
};