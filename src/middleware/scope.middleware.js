
const getGeoScope = (user) => {
  const { role, station_id, district_id, province_id } = user;

  // admins see everything
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

  // station officers can see district related data
  return { type: "district", station_id, district_id, province_id };
};

/**
 * Builds Sequelize where/include filters for direct Driver queries.
 * Province scope needs a JOIN through District since there's no direct province_id on Driver.
 */
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

/**
 * Patches an existing Driver include with geo filters instead of creating a new one.
 * Use this when Driver is already nested inside an Assignment or Ping query.
 */
const applyScopeToDriverInclude = (scope, driverInclude, models) => {
  if (scope.type === "all") {
    return driverInclude;
  }

  const scoped = { ...driverInclude, required: true };

  if (scope.type === "district") {
    scoped.where = {
      ...(driverInclude.where || {}),
      district_id: scope.district_id,
    };
    return scoped;
  }

  // province — sub-include JOIN through District
  scoped.include = [
    ...(driverInclude.include || []),
    {
      model: models.District,
      as: "district",
      where: { province_id: scope.province_id },
      required: true,
      attributes: ["district_id", "district_name", "district_code"],
    },
  ];
  return scoped;
};

module.exports = {
  getGeoScope,
  buildDriverScope,
  applyScopeToDriverInclude,
};
