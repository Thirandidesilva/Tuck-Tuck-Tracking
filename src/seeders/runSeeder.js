const { connectDB } = require("../config/db");
const db = require("../models");

const seedProvinces = require("./province.seeder");
const seedDistricts = require("./district.seeder");
const seedPoliceStations = require("./policeStation.seeder");
const seedDrivers = require("./driver.seeder");
const seedUsers = require("./user.seeder");
const seedTestData = require("./testData.seeder");

const run = async () => {
  try {
    await connectDB();

    await db.sequelize.sync();

    await seedProvinces();
    await seedDistricts();
    await seedPoliceStations();
    await seedDrivers();
    await seedUsers();
    await seedTestData();

    console.log("Seeding completed successfully");
    process.exit();
  } catch (error) {
    console.error("Seeder run failed:", error);
    process.exit(1);
  }
};

run();
