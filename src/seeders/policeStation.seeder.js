const db = require("../models");

const seedPoliceStations = async () => {
  try {
    const districts = await db.District.findAll();

    const getDistrictId = (name) => {
      const district = districts.find((d) => d.district_name === name);
      if (!district) {
        throw new Error(`District not found: ${name}`);
      }
      return district.district_id;
    };

    await db.PoliceStation.bulkCreate(
      [
        // Colombo
        {
          district_id: getDistrictId("Colombo"),
          station_name: "Colombo Fort Police Station",
          station_code: "COL-FORT",
          address: "Fort, Colombo",
          contact_number: "0112421111"
        },
        {
          district_id: getDistrictId("Colombo"),
          station_name: "Pettah Police Station",
          station_code: "COL-PET",
          address: "Pettah, Colombo",
          contact_number: "0112322222"
        },

        // Gampaha
        {
          district_id: getDistrictId("Gampaha"),
          station_name: "Negombo Police Station",
          station_code: "GAM-NEG",
          address: "Negombo, Gampaha",
          contact_number: "0312223333"
        },
        {
          district_id: getDistrictId("Gampaha"),
          station_name: "Gampaha Police Station",
          station_code: "GAM-GAM",
          address: "Gampaha Town",
          contact_number: "0332224444"
        },

        // Kalutara
        {
          district_id: getDistrictId("Kalutara"),
          station_name: "Kalutara South Police Station",
          station_code: "KLU-KS",
          address: "Kalutara South",
          contact_number: "0342225555"
        },

        // Kandy
        {
          district_id: getDistrictId("Kandy"),
          station_name: "Kandy Police Station",
          station_code: "KAN-KAN",
          address: "Kandy Town",
          contact_number: "0812226666"
        },
        {
          district_id: getDistrictId("Kandy"),
          station_name: "Peradeniya Police Station",
          station_code: "KAN-PER",
          address: "Peradeniya",
          contact_number: "0812387777"
        },

        // Matale
        {
          district_id: getDistrictId("Matale"),
          station_name: "Matale Police Station",
          station_code: "MAT-MAT",
          address: "Matale Town",
          contact_number: "0662228888"
        },

        // Nuwara Eliya
        {
          district_id: getDistrictId("Nuwara Eliya"),
          station_name: "Nuwara Eliya Police Station",
          station_code: "NUE-NUE",
          address: "Nuwara Eliya Town",
          contact_number: "0522229999"
        },

        // Galle
        {
          district_id: getDistrictId("Galle"),
          station_name: "Galle Police Station",
          station_code: "GAL-GAL",
          address: "Galle Town",
          contact_number: "0912231111"
        },

        // Matara
        {
          district_id: getDistrictId("Matara"),
          station_name: "Matara Police Station",
          station_code: "MTR-MTR",
          address: "Matara Town",
          contact_number: "0412221212"
        },

        // Hambantota
        {
          district_id: getDistrictId("Hambantota"),
          station_name: "Hambantota Police Station",
          station_code: "HAM-HAM",
          address: "Hambantota Town",
          contact_number: "0472221313"
        },

        // Jaffna
        {
          district_id: getDistrictId("Jaffna"),
          station_name: "Jaffna Police Station",
          station_code: "JAF-JAF",
          address: "Jaffna Town",
          contact_number: "0212221414"
        },

        // Kilinochchi
        {
          district_id: getDistrictId("Kilinochchi"),
          station_name: "Kilinochchi Police Station",
          station_code: "KIL-KIL",
          address: "Kilinochchi Town",
          contact_number: "0212281515"
        },

        // Mannar
        {
          district_id: getDistrictId("Mannar"),
          station_name: "Mannar Police Station",
          station_code: "MAN-MAN",
          address: "Mannar Town",
          contact_number: "0232221616"
        },

        // Mullaitivu
        {
          district_id: getDistrictId("Mullaitivu"),
          station_name: "Mullaitivu Police Station",
          station_code: "MUL-MUL",
          address: "Mullaitivu Town",
          contact_number: "0212291717"
        },

        // Vavuniya
        {
          district_id: getDistrictId("Vavuniya"),
          station_name: "Vavuniya Police Station",
          station_code: "VAV-VAV",
          address: "Vavuniya Town",
          contact_number: "0242221818"
        },

        // Trincomalee
        {
          district_id: getDistrictId("Trincomalee"),
          station_name: "Trincomalee Police Station",
          station_code: "TRI-TRI",
          address: "Trincomalee Town",
          contact_number: "0262221919"
        },

        // Batticaloa
        {
          district_id: getDistrictId("Batticaloa"),
          station_name: "Batticaloa Police Station",
          station_code: "BAT-BAT",
          address: "Batticaloa Town",
          contact_number: "0652222020"
        },

        // Ampara
        {
          district_id: getDistrictId("Ampara"),
          station_name: "Ampara Police Station",
          station_code: "AMP-AMP",
          address: "Ampara Town",
          contact_number: "0632222121"
        },

        // Kurunegala
        {
          district_id: getDistrictId("Kurunegala"),
          station_name: "Kurunegala Police Station",
          station_code: "KUR-KUR",
          address: "Kurunegala Town",
          contact_number: "0372222222"
        },

        // Puttalam
        {
          district_id: getDistrictId("Puttalam"),
          station_name: "Puttalam Police Station",
          station_code: "PUT-PUT",
          address: "Puttalam Town",
          contact_number: "0322222323"
        },

        // Anuradhapura
        {
          district_id: getDistrictId("Anuradhapura"),
          station_name: "Anuradhapura Police Station",
          station_code: "ANU-ANU",
          address: "Anuradhapura Town",
          contact_number: "0252222424"
        },

        // Polonnaruwa
        {
          district_id: getDistrictId("Polonnaruwa"),
          station_name: "Polonnaruwa Police Station",
          station_code: "POL-POL",
          address: "Polonnaruwa Town",
          contact_number: "0272222525"
        },

        // Badulla
        {
          district_id: getDistrictId("Badulla"),
          station_name: "Badulla Police Station",
          station_code: "BAD-BAD",
          address: "Badulla Town",
          contact_number: "0552222626"
        },

        // Monaragala
        {
          district_id: getDistrictId("Monaragala"),
          station_name: "Monaragala Police Station",
          station_code: "MON-MON",
          address: "Monaragala Town",
          contact_number: "0552272727"
        },

        // Ratnapura
        {
          district_id: getDistrictId("Ratnapura"),
          station_name: "Ratnapura Police Station",
          station_code: "RAT-RAT",
          address: "Ratnapura Town",
          contact_number: "0452222828"
        },

        // Kegalle
        {
          district_id: getDistrictId("Kegalle"),
          station_name: "Kegalle Police Station",
          station_code: "KEG-KEG",
          address: "Kegalle Town",
          contact_number: "0352222929"
        }
      ],
      { ignoreDuplicates: true }
    );

    console.log("Police stations seeded successfully");
  } catch (err) {
    console.error("Error seeding police stations:", err);
  }
};

module.exports = seedPoliceStations;