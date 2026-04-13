const bcrypt = require("bcrypt");
const db = require("../models");

const seedUsers = async () => {
  try {
    const stations = await db.PoliceStation.findAll();

    const getStationId = (code) => {
      const station = stations.find((s) => s.station_code === code);
      if (!station) throw new Error(`Station not found: ${code}`);
      return station.station_id;
    };

    const password_hash = await bcrypt.hash("Password@123", 10);

    await db.UserAccount.bulkCreate(
      [
        // HQ-level — no station, see everything
        {
          full_name: "System Admin",
          email: "admin@test.com",
          password_hash,
          role: "SYSTEM_ADMIN",
          station_id: null,
          account_status: "ACTIVE",
        },
        {
          full_name: "HQ Admin",
          email: "hq@test.com",
          password_hash,
          role: "HQ_ADMIN",
          station_id: null,
          account_status: "ACTIVE",
        },

        // Western Province — Colombo Fort station
        // province scope: sees all of Western Province
        {
          full_name: "Provincial Officer Western",
          email: "provincial@test.com",
          password_hash,
          role: "PROVINCIAL_OFFICER",
          station_id: getStationId("COL-FORT"),
          account_status: "ACTIVE",
        },

        // Colombo district — Colombo Fort station
        // district scope: sees only Colombo District
        {
          full_name: "Station Officer Colombo",
          email: "station@test.com",
          password_hash,
          role: "STATION_OFFICER",
          station_id: getStationId("COL-FORT"),
          account_status: "ACTIVE",
        },

        // Central Province — Kandy station 
        {
          full_name: "Provincial Officer Central",
          email: "provincial.central@test.com",
          password_hash,
          role: "PROVINCIAL_OFFICER",
          station_id: getStationId("KAN-KAN"),
          account_status: "ACTIVE",
        },

        // Kandy district — Kandy station 
        {
          full_name: "Station Officer Kandy",
          email: "station.kandy@test.com",
          password_hash,
          role: "STATION_OFFICER",
          station_id: getStationId("KAN-KAN"),
          account_status: "ACTIVE",
        },
      ],
      { ignoreDuplicates: true }
    );

    console.log("6 test users seeded successfully (password: Password@123)");
  } catch (err) {
    console.error("Error seeding users:", err);
  }
};

module.exports = seedUsers;
