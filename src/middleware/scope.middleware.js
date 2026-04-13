const getGeoScope = (user) => {
  const { role, station_id, district_id, province_id } = user;

  if (role === "SYSTEM_ADMIN" || role === "HQ_ADMIN") {
    return {
      type: "all",
      station_id: null,
      district_id: null,
      province_id: null,
    };
  }

  if (role === "PROVINCIAL_OFFICER") {
    return { type: "province", station_id, district_id, province_id };
  }

  // station officers are the most restricted
  return { type: "district", station_id, district_id, province_id };
};

const buildDriverScope = (scope, models) => {
  if (scope.type === "all") {
    return { where: {}, include: [] };
  }

  if (scope.type === "district") {
    return { where: { district_id: scope.district_id }, include: [] };
  }

  // province — have to JOIN through District
  return {
    where: {},
    include: [
      {
        model: models.District,
        as: "district",
        where: { province_id: scope.province_id },
        required: true,
        attributes: ["district_id", "district_name", "district_code"],
        include: [
          {
            model: models.Province,
            as: "province",
            attributes: ["province_id", "province_name", "province_code"],
          },
        ],
      },
    ],
  };
};

const applyScopeToDriverInclude = (scope, driverInclude, models) => {
  const districtWithProvince = {
    model: models.District,
    as: "district",
    attributes: ["district_id", "district_name", "district_code"],
    include: [
      {
        model: models.Province,
        as: "province",
        attributes: ["province_id", "province_name", "province_code"],
      },
    ],
  };

  // Admins see everything 
  if (scope.type === "all") {
    return {
      ...driverInclude,
      include: [...(driverInclude.include || []), districtWithProvince],
    };
  }

  const scoped = { ...driverInclude, required: true };

  if (scope.type === "district") {
    scoped.where = {
      ...(driverInclude.where || {}),
      district_id: scope.district_id,
    };
    scoped.include = [
      ...(driverInclude.include || []),
      {
        ...districtWithProvince,
        ...(scope.province_id != null
          ? { where: { province_id: scope.province_id }, required: true }
          : {}),
      },
    ];
    return scoped;
  }

  // province — INNER JOIN through District filtered by province_id
  scoped.include = [
    ...(driverInclude.include || []),
    {
      ...districtWithProvince,
      where: { province_id: scope.province_id },
      required: true,
    },
  ];
  return scoped;
};

/**
 * Validates that query param overrides (district_id, province_id) don't exceed
 * the user's JWT scope. Returns null if valid, or { statusCode, message } if not.
 * Call this before resolveEffectiveScope so the user gets a clear 403 instead of
 * an empty result set.
 */
const validateScopeOverrides = async (jwtScope, query, models) => {
  if (jwtScope.type === "all") return null;

  if (jwtScope.type === "province") {
    if (
      query.province_id &&
      parseInt(query.province_id) !== jwtScope.province_id
    ) {
      return {
        statusCode: 403,
        message: "You can only view data within your own province",
      };
    }
    if (query.district_id) {
      const district = await models.District.findByPk(
        parseInt(query.district_id),
      );
      if (!district || district.province_id !== jwtScope.province_id) {
        return {
          statusCode: 403,
          message: "The requested district is outside your province",
        };
      }
    }
  }

  if (jwtScope.type === "district") {
    if (
      query.district_id &&
      parseInt(query.district_id) !== jwtScope.district_id
    ) {
      return {
        statusCode: 403,
        message: "You can only view data within your own district",
      };
    }
    if (
      query.province_id &&
      parseInt(query.province_id) !== jwtScope.province_id
    ) {
      return {
        statusCode: 403,
        message: "You can only view data within your own province",
      };
    }
  }

  return null;
};

module.exports = {
  getGeoScope,
  buildDriverScope,
  applyScopeToDriverInclude,
  validateScopeOverrides,
};
