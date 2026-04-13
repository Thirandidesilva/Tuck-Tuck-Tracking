const cron = require("node-cron");
const db = require("../models");
const { getBoundsForDistrict } = require("./districtBounds");

function randomInRange(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(7));
}

async function generateRandomPing() {
  try {
    // Fetch all active assignments, joining driver → district to get the
    // district code needed for geographic bounds lookup
    const activeAssignments = await db.VehicleAssignment.findAll({
      where: { status: "ACTIVE" },
      attributes: ["assignment_id"],
      include: [
        {
          model: db.Driver,
          as: "driver",
          attributes: ["driver_id"],
          include: [
            {
              model: db.District,
              as: "district",
              attributes: ["district_code", "district_name"],
            },
          ],
        },
      ],
    });

    if (activeAssignments.length === 0) {
      console.log("[LocationPingJob] No active assignments found, skipping.");
      return;
    }

    // Pick a random assignment
    const randomIndex = Math.floor(Math.random() * activeAssignments.length);
    const assignment = activeAssignments[randomIndex];

    const districtCode = assignment.driver?.district?.district_code;
    const districtName = assignment.driver?.district?.district_name || "Unknown";
    const bounds = getBoundsForDistrict(districtCode);

    // Generate random coordinates within the driver's district
    const latitude = randomInRange(bounds.latMin, bounds.latMax);
    const longitude = randomInRange(bounds.lngMin, bounds.lngMax);
    const speed = parseFloat((Math.random() * 60).toFixed(1));   // 0–60 km/h
    const heading = parseFloat((Math.random() * 360).toFixed(1)); // 0–360°

    await db.LocationPing.create({
      assignment_id: assignment.assignment_id,
      latitude,
      longitude,
      speed,
      heading,
      recorded_at: new Date(),
    });

    console.log(
      `[LocationPingJob] Ping created — assignment: ${assignment.assignment_id}, district: ${districtName} (${districtCode}), lat: ${latitude}, lng: ${longitude}, speed: ${speed} km/h`
    );
  } catch (error) {
    console.error("[LocationPingJob] Failed to create ping:", error.message);
  }
}

function startLocationPingJob() {
  cron.schedule("* * * * *", generateRandomPing);
  console.log("[LocationPingJob] Scheduled — fires every 1 minute.");
}

module.exports = { startLocationPingJob };
