const db = require("../models");

const seedDistricts = async () => {
  try {
    const provinces = await db.Province.findAll();

    const getProvinceId = (name) => {
      const province = provinces.find((p) => p.province_name === name);
      if (!province) {
        throw new Error(`Province not found: ${name}`);
      }
      return province.province_id;
    };

    await db.District.bulkCreate(
      [
        // Western
        { district_name: "Colombo", district_code: "COL", province_id: getProvinceId("Western") },
        { district_name: "Gampaha", district_code: "GAM", province_id: getProvinceId("Western") },
        { district_name: "Kalutara", district_code: "KLU", province_id: getProvinceId("Western") },

        // Central
        { district_name: "Kandy", district_code: "KAN", province_id: getProvinceId("Central") },
        { district_name: "Matale", district_code: "MAT", province_id: getProvinceId("Central") },
        { district_name: "Nuwara Eliya", district_code: "NUE", province_id: getProvinceId("Central") },

        // Southern
        { district_name: "Galle", district_code: "GAL", province_id: getProvinceId("Southern") },
        { district_name: "Matara", district_code: "MTR", province_id: getProvinceId("Southern") },
        { district_name: "Hambantota", district_code: "HAM", province_id: getProvinceId("Southern") },

        // Northern
        { district_name: "Jaffna", district_code: "JAF", province_id: getProvinceId("Northern") },
        { district_name: "Kilinochchi", district_code: "KIL", province_id: getProvinceId("Northern") },
        { district_name: "Mannar", district_code: "MAN", province_id: getProvinceId("Northern") },
        { district_name: "Mullaitivu", district_code: "MUL", province_id: getProvinceId("Northern") },
        { district_name: "Vavuniya", district_code: "VAV", province_id: getProvinceId("Northern") },

        // Eastern
        { district_name: "Trincomalee", district_code: "TRI", province_id: getProvinceId("Eastern") },
        { district_name: "Batticaloa", district_code: "BAT", province_id: getProvinceId("Eastern") },
        { district_name: "Ampara", district_code: "AMP", province_id: getProvinceId("Eastern") },

        // North Western
        { district_name: "Kurunegala", district_code: "KUR", province_id: getProvinceId("North Western") },
        { district_name: "Puttalam", district_code: "PUT", province_id: getProvinceId("North Western") },

        // North Central
        { district_name: "Anuradhapura", district_code: "ANU", province_id: getProvinceId("North Central") },
        { district_name: "Polonnaruwa", district_code: "POL", province_id: getProvinceId("North Central") },

        // Uva
        { district_name: "Badulla", district_code: "BAD", province_id: getProvinceId("Uva") },
        { district_name: "Monaragala", district_code: "MON", province_id: getProvinceId("Uva") },

        // Sabaragamuwa
        { district_name: "Ratnapura", district_code: "RAT", province_id: getProvinceId("Sabaragamuwa") },
        { district_name: "Kegalle", district_code: "KEG", province_id: getProvinceId("Sabaragamuwa") },
      ],
      { ignoreDuplicates: true }
    );

    console.log("25 districts seeded successfully");
  } catch (err) {
    console.error("Error seeding districts:", err);
  }
};

module.exports = seedDistricts;