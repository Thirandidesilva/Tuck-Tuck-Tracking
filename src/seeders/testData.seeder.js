const db = require("../models");

const seedTestData = async () => {
  try {
    const drivers = await db.Driver.findAll({
      include: [{ model: db.District, as: "district", attributes: ["district_name"] }],
    });

    const getDriverId = (nic) => {
      const driver = drivers.find((d) => d.nic === nic);
      if (!driver) throw new Error(`Driver not found with NIC: ${nic}`);
      return driver.driver_id;
    };

    // Colombo driver: Kamal Perera
    const colomboDriverId = getDriverId("198812345678");
    // Kandy driver: Pradeep Jayawardena
    const kandyDriverId = getDriverId("199067890123");

    // ── Vehicles ──────────────────────────────────────────────────────────────
    const [vehicleColombo, vehicleKandy] = await Promise.all([
      db.Vehicle.findOrCreate({
        where: { registration_number: "WP-TUK-001" },
        defaults: {
          registration_number: "WP-TUK-001",
          vehicle_type: "Three-Wheeler",
          model: "Bajaj RE",
          color: "Yellow",
          year_of_manufacture: 2020,
          chassis_number: "CHASSIS-COL-001",
          engine_number: "ENGINE-COL-001",
          status: "ACTIVE",
        },
      }),
      db.Vehicle.findOrCreate({
        where: { registration_number: "CP-TUK-001" },
        defaults: {
          registration_number: "CP-TUK-001",
          vehicle_type: "Three-Wheeler",
          model: "Bajaj RE",
          color: "Green",
          year_of_manufacture: 2021,
          chassis_number: "CHASSIS-KAN-001",
          engine_number: "ENGINE-KAN-001",
          status: "ACTIVE",
        },
      }),
    ]);

    // ── Tracking Devices ──────────────────────────────────────────────────────
    const [deviceColombo, deviceKandy] = await Promise.all([
      db.TrackingDevice.findOrCreate({
        where: { device_serial_number: "DEV-COL-001" },
        defaults: {
          device_serial_number: "DEV-COL-001",
          sim_number: "SIM-COL-001",
          manufacturer: "Teltonika",
          model: "FMB920",
          installation_date: "2024-01-01",
          status: "ACTIVE",
        },
      }),
      db.TrackingDevice.findOrCreate({
        where: { device_serial_number: "DEV-KAN-001" },
        defaults: {
          device_serial_number: "DEV-KAN-001",
          sim_number: "SIM-KAN-001",
          manufacturer: "Teltonika",
          model: "FMB920",
          installation_date: "2024-01-01",
          status: "ACTIVE",
        },
      }),
    ]);

    // ── Assignments ───────────────────────────────────────────────────────────
    const [assignmentColombo, assignmentKandy] = await Promise.all([
      db.VehicleAssignment.findOrCreate({
        where: { driver_id: colomboDriverId, status: "ACTIVE" },
        defaults: {
          driver_id: colomboDriverId,
          vehicle_id: vehicleColombo[0].vehicle_id,
          device_id: deviceColombo[0].device_id,
          assigned_at: new Date(),
          status: "ACTIVE",
          notes: "Test assignment — Colombo",
        },
      }),
      db.VehicleAssignment.findOrCreate({
        where: { driver_id: kandyDriverId, status: "ACTIVE" },
        defaults: {
          driver_id: kandyDriverId,
          vehicle_id: vehicleKandy[0].vehicle_id,
          device_id: deviceKandy[0].device_id,
          assigned_at: new Date(),
          status: "ACTIVE",
          notes: "Test assignment — Kandy",
        },
      }),
    ]);

    const colomboAssignmentId = assignmentColombo[0].assignment_id;
    const kandyAssignmentId = assignmentKandy[0].assignment_id;

    // ── Location Pings ────────────────────────────────────────────────────────
    await db.LocationPing.bulkCreate(
      [
        // Colombo pings (near Colombo Fort)
        {
          assignment_id: colomboAssignmentId,
          latitude: 6.9344,
          longitude: 79.8428,
          speed: 25.5,
          heading: 90,
          recorded_at: new Date(Date.now() - 10 * 60 * 1000), // 10 min ago
        },
        {
          assignment_id: colomboAssignmentId,
          latitude: 6.9355,
          longitude: 79.8445,
          speed: 18.0,
          heading: 120,
          recorded_at: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
        },
        // Kandy pings (near Kandy town)
        {
          assignment_id: kandyAssignmentId,
          latitude: 7.2906,
          longitude: 80.6337,
          speed: 15.0,
          heading: 45,
          recorded_at: new Date(Date.now() - 8 * 60 * 1000), // 8 min ago
        },
        {
          assignment_id: kandyAssignmentId,
          latitude: 7.2915,
          longitude: 80.6350,
          speed: 10.5,
          heading: 60,
          recorded_at: new Date(Date.now() - 3 * 60 * 1000), // 3 min ago
        },
      ],
      { ignoreDuplicates: false }
    );

    console.log("Test data seeded:");
    console.log(`  Colombo assignment ID: ${colomboAssignmentId} (driver: Kamal Perera, vehicle: WP-TUK-001)`);
    console.log(`  Kandy assignment ID:   ${kandyAssignmentId} (driver: Pradeep Jayawardena, vehicle: CP-TUK-001)`);
    console.log("  4 location pings created (2 Colombo, 2 Kandy)");
  } catch (err) {
    console.error("Error seeding test data:", err);
  }
};

module.exports = seedTestData;
