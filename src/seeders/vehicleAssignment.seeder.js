const { Op } = require("sequelize");
const db = require("../models");

const seedVehicleAssignments = async () => {
  try {
    // ── Create 200 tracking devices (one per seeded vehicle) ──────────────────
    const manufacturers = ["Teltonika", "Queclink", "Concox"];
    const deviceModels  = ["FMB920",    "GV310LAU", "GT06N"];

    const deviceData = [];
    for (let i = 1; i <= 200; i++) {
      const num = String(i).padStart(4, "0");
      const idx = (i - 1) % 3;
      deviceData.push({
        device_serial_number: `DEV-TUK-${num}`,
        sim_number:           `SIM-TUK-${num}`,
        manufacturer:         manufacturers[idx],
        model:                deviceModels[idx],
        installation_date:    "2024-01-15",
        status:               "ACTIVE",
      });
    }

    await db.TrackingDevice.bulkCreate(deviceData, { ignoreDuplicates: true });

    const devices = await db.TrackingDevice.findAll({
      where: { device_serial_number: { [Op.like]: "DEV-TUK-%" } },
      order: [["device_id", "ASC"]],
    });

    console.log(`${devices.length} tracking devices ready`);

    // ── Fetch ACTIVE drivers ──────────────────────────────────────────────────
    const activeDrivers = await db.Driver.findAll({
      where: { status: "ACTIVE" },
      order: [["created_at", "ASC"]],
    });

    // ── Fetch ACTIVE vehicles from the main vehicle seeder (XX-3-XXXX format) ─
    const activeVehicles = await db.Vehicle.findAll({
      where: {
        status: "ACTIVE",
        registration_number: { [Op.like]: "%-3-%" },
      },
      order: [["created_at", "ASC"]],
    });

    // ── Skip drivers / vehicles already in an ACTIVE assignment ───────────────
    const existingActive = await db.VehicleAssignment.findAll({
      where: { status: "ACTIVE" },
    });
    const assignedDriverIds  = new Set(existingActive.map((a) => a.driver_id));
    const assignedVehicleIds = new Set(existingActive.map((a) => a.vehicle_id));

    const freeDrivers  = activeDrivers .filter((d) => !assignedDriverIds .has(d.driver_id));
    const freeVehicles = activeVehicles.filter((v) => !assignedVehicleIds.has(v.vehicle_id));

    // ── Build 1 : 1 assignments ───────────────────────────────────────────────
    const count = Math.min(freeDrivers.length, freeVehicles.length, devices.length);

    const assignments = [];
    for (let i = 0; i < count; i++) {
      // Spread assigned_at across Jan–Mar 2024 (one new day every 4 assignments)
      const assignedAt = new Date(2024, 0, 15 + Math.floor(i / 4));

      assignments.push({
        driver_id:   freeDrivers[i].driver_id,
        vehicle_id:  freeVehicles[i].vehicle_id,
        device_id:   devices[i].device_id,
        assigned_at: assignedAt,
        status:      "ACTIVE",
        notes:       `${freeDrivers[i].full_name} — ${freeVehicles[i].registration_number}`,
      });
    }

    await db.VehicleAssignment.bulkCreate(assignments, { ignoreDuplicates: true });

    console.log(`${count} vehicle assignments seeded successfully`);
    console.log(`  Active drivers available : ${freeDrivers.length}`);
    console.log(`  Active vehicles available: ${freeVehicles.length}`);
  } catch (err) {
    console.error("Error seeding vehicle assignments:", err);
  }
};

module.exports = seedVehicleAssignments;
