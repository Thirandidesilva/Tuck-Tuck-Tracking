const { connectDB } = require("../config/db");
const db = require("../models");

const seedProvinces = require("./province.seeder");
const seedDistricts = require("./district.seeder");
const seedPoliceStations = require("./policeStation.seeder");

const run = async () => {
  try {
    await connectDB();

    await db.sequelize.sync();

    await seedProvinces();
    await seedDistricts();
    await seedPoliceStations();

    console.log("Seeding completed successfully");
    process.exit();
  } catch (error) {
    console.error("Seeder run failed:", error);
    process.exit(1);
  }
};

run();