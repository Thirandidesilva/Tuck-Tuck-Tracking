const { connectDB } = require("../config/db");
const db = require("../models");

const seedProvinces = require("./province.seeder");
const seedDistricts = require("./district.seeder");
const seedPoliceStations = require("./policeStation.seeder");
const seedDrivers = require("./driver.seeder");
const seedVehicles = require("./vehicle.seeder");
const seedUsers = require("./user.seeder");
const seedTestData = require("./testData.seeder");
const seedVehicleAssignments = require("./vehicleAssignment.seeder");

const run = async () => {
  try {
    await connectDB();

    await db.sequelize.sync();

    await seedProvinces();
    await seedDistricts();
    await seedPoliceStations();
    await seedDrivers();
    await seedVehicles();
    await seedUsers();
    await seedTestData();
    await seedVehicleAssignments();

    console.log("Seeding completed successfully");
    process.exit();
  } catch (error) {
    console.error("Seeder run failed:", error);
    process.exit(1);
  }
};

run();
