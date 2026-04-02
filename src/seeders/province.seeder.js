const db = require("../models");

const seedProvinces = async () => {
  try {
    await db.Province.bulkCreate([
      { province_name: "Western", province_code: "WP" },
      { province_name: "Central", province_code: "CP" },
      { province_name: "Southern", province_code: "SP" },
      { province_name: "Northern", province_code: "NP" },
      { province_name: "Eastern", province_code: "EP" },
      { province_name: "North Western", province_code: "NWP" },
      { province_name: "North Central", province_code: "NCP" },
      { province_name: "Uva", province_code: "UP" },
      { province_name: "Sabaragamuwa", province_code: "SGP" }
    ]);

    console.log("Provinces seeded successfully");
  } catch (err) {
    console.error("Error seeding provinces:", err);
  }
};

module.exports = seedProvinces;