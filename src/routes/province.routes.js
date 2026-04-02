const {
  getAllProvinces,
  getProvinceById,
  createProvince,
  updateProvince,
  deleteProvince
} = require("../controllers/province.controller");

const provinceRoutes = async (req, res, pathname, query) => {
  if (req.method === "GET" && pathname === "/api/v1/provinces") {
    return getAllProvinces(req, res, query);
  }

  if (req.method === "POST" && pathname === "/api/v1/provinces") {
    return createProvince(req, res);
  }

  const provinceMatch = pathname.match(/^\/api\/v1\/provinces\/(\d+)$/);

  if (provinceMatch) {
    const provinceId = provinceMatch[1];

    if (req.method === "GET") {
      return getProvinceById(req, res, provinceId);
    }

    if (req.method === "PATCH") {
      return updateProvince(req, res, provinceId);
    }

    if (req.method === "DELETE") {
      return deleteProvince(req, res, provinceId);
    }
  }

  return false;
};

module.exports = provinceRoutes;