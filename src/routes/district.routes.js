const {
  getAllDistricts,
  getDistrictById,
  createDistrict,
  updateDistrict,
  deleteDistrict
} = require("../controllers/district.controller");

const districtRoutes = async (req, res, pathname, query) => {
  if (req.method === "GET" && pathname === "/api/v1/districts") {
    return getAllDistricts(req, res, query);
  }

  if (req.method === "POST" && pathname === "/api/v1/districts") {
    return createDistrict(req, res);
  }

  const districtMatch = pathname.match(/^\/api\/v1\/districts\/(\d+)$/);

  if (districtMatch) {
    const districtId = districtMatch[1];

    if (req.method === "GET") {
      return getDistrictById(req, res, districtId);
    }

    if (req.method === "PATCH") {
      return updateDistrict(req, res, districtId);
    }

    if (req.method === "DELETE") {
      return deleteDistrict(req, res, districtId);
    }
  }

  return false;
};

module.exports = districtRoutes;