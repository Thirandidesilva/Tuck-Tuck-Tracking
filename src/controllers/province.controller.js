const db = require("../models");
const parseBody = require("../utils/parseBody");
const sendJson = require("../utils/sendJson");

const { Province } = db;

const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(query.limit, 10) || 10, 1);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

const getProvinceSort = (query) => {
  const allowedSortFields = {
    provinceId: "province_id",
    provinceName: "province_name",
    provinceCode: "province_code",
    province_id: "province_id",
    province_name: "province_name",
    province_code: "province_code"
  };

  const sortBy = allowedSortFields[query.sortBy] || "province_name";
  const order = String(query.order || "ASC").toUpperCase() === "DESC" ? "DESC" : "ASC";

  return { sortBy, order };
};

const getAllProvinces = async (req, res, query) => {
  try {
    const { page, limit, offset } = getPagination(query);
    const { sortBy, order } = getProvinceSort(query);

    const { count, rows } = await Province.findAndCountAll({
      order: [[sortBy, order]],
      limit,
      offset
    });

    return sendJson(res, 200, {
      success: true,
      message: "Provinces retrieved successfully",
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit)
      },
      data: rows
    });
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch provinces"
    });
  }
};

const getProvinceById = async (req, res, provinceId) => {
  try {
    const province = await Province.findByPk(provinceId);

    if (!province) {
      return sendJson(res, 404, {
        success: false,
        message: "Province not found"
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: "Province retrieved successfully",
      data: province
    });
  } catch (error) {
    console.error("Error fetching province:", error);
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch province"
    });
  }
};

const createProvince = async (req, res) => {
  try {
    const body = await parseBody(req);

    const provinceName = body.provinceName || body.province_name;
    const provinceCode = body.provinceCode || body.province_code;

    if (!provinceName || !provinceCode) {
      return sendJson(res, 400, {
        success: false,
        message: "provinceName and provinceCode are required"
      });
    }

    const existingProvince = await Province.findOne({
      where: { province_code: provinceCode }
    });

    if (existingProvince) {
      return sendJson(res, 409, {
        success: false,
        message: "Province code already exists"
      });
    }

    const province = await Province.create({
      province_name: provinceName,
      province_code: provinceCode
    });

    return sendJson(res, 201, {
      success: true,
      message: "Province created successfully",
      data: province
    });
  } catch (error) {
    console.error("Error creating province:", error);

    if (error.message === "Invalid JSON body") {
      return sendJson(res, 400, {
        success: false,
        message: "Invalid JSON body"
      });
    }

    return sendJson(res, 500, {
      success: false,
      message: "Failed to create province"
    });
  }
};

const updateProvince = async (req, res, provinceId) => {
  try {
    const province = await Province.findByPk(provinceId);

    if (!province) {
      return sendJson(res, 404, {
        success: false,
        message: "Province not found"
      });
    }

    const body = await parseBody(req);
    const updates = {};

    if (body.provinceName || body.province_name) {
      updates.province_name = body.provinceName || body.province_name;
    }

    if (body.provinceCode || body.province_code) {
      const newCode = body.provinceCode || body.province_code;

      const existingProvince = await Province.findOne({
        where: { province_code: newCode }
      });

      if (existingProvince && existingProvince.province_id !== province.province_id) {
        return sendJson(res, 409, {
          success: false,
          message: "Province code already exists"
        });
      }

      updates.province_code = newCode;
    }

    if (Object.keys(updates).length === 0) {
      return sendJson(res, 400, {
        success: false,
        message: "At least one field is required to update"
      });
    }

    await province.update(updates);

    return sendJson(res, 200, {
      success: true,
      message: "Province updated successfully",
      data: province
    });
  } catch (error) {
    console.error("Error updating province:", error);

    if (error.message === "Invalid JSON body") {
      return sendJson(res, 400, {
        success: false,
        message: "Invalid JSON body"
      });
    }

    return sendJson(res, 500, {
      success: false,
      message: "Failed to update province"
    });
  }
};

const deleteProvince = async (req, res, provinceId) => {
  try {
    const province = await Province.findByPk(provinceId);

    if (!province) {
      return sendJson(res, 404, {
        success: false,
        message: "Province not found"
      });
    }

    await province.destroy();

    return sendJson(res, 200, {
      success: true,
      message: "Province deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting province:", error);
    return sendJson(res, 500, {
      success: false,
      message: "Failed to delete province. It may be linked to districts."
    });
  }
};

module.exports = {
  getAllProvinces,
  getProvinceById,
  createProvince,
  updateProvince,
  deleteProvince
};