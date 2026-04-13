const db = require("../models");

const seedDrivers = async () => {
  try {
    const districts = await db.District.findAll();

    const getDistrictId = (name) => {
      const district = districts.find((d) => d.district_name === name);
      if (!district) {
        throw new Error(`District not found: ${name}`);
      }
      return district.district_id;
    };

    await db.Driver.bulkCreate(
      [
        // Western Province — Colombo
        {
          district_id: getDistrictId("Colombo"),
          full_name: "Kamal Perera",
          nic: "198812345678",
          license_number: "LCN-COL-001",
          phone_number: "0771234001",
          address: "45 Galle Road, Colombo 03",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Colombo"),
          full_name: "Nuwan Silva",
          nic: "199023456789",
          license_number: "LCN-COL-002",
          phone_number: "0771234002",
          address: "12 Union Place, Colombo 02",
          status: "ACTIVE"
        },

        // Western Province — Gampaha
        {
          district_id: getDistrictId("Gampaha"),
          full_name: "Ranjith Fernando",
          nic: "198734567890",
          license_number: "LCN-GAM-001",
          phone_number: "0771234003",
          address: "78 Negombo Road, Gampaha",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Gampaha"),
          full_name: "Lasith Rajapaksa",
          nic: "199145678901",
          license_number: "LCN-GAM-002",
          phone_number: "0771234004",
          address: "23 Main Street, Negombo",
          status: "INACTIVE"
        },

        // Western Province — Kalutara
        {
          district_id: getDistrictId("Kalutara"),
          full_name: "Saman Wickramasinghe",
          nic: "198956789012",
          license_number: "LCN-KLU-001",
          phone_number: "0771234005",
          address: "56 Beach Road, Kalutara",
          status: "ACTIVE"
        },

        // Central Province — Kandy
        {
          district_id: getDistrictId("Kandy"),
          full_name: "Pradeep Jayawardena",
          nic: "199067890123",
          license_number: "LCN-KAN-001",
          phone_number: "0771234006",
          address: "34 Peradeniya Road, Kandy",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kandy"),
          full_name: "Chamara Dissanayake",
          nic: "198878901234",
          license_number: "LCN-KAN-002",
          phone_number: "0771234007",
          address: "89 Katugastota Road, Kandy",
          status: "ACTIVE"
        },

        // Central Province — Matale
        {
          district_id: getDistrictId("Matale"),
          full_name: "Thilak Senanayake",
          nic: "199189012345",
          license_number: "LCN-MAT-001",
          phone_number: "0771234008",
          address: "17 Kandy Road, Matale",
          status: "ACTIVE"
        },

        // Central Province — Nuwara Eliya
        {
          district_id: getDistrictId("Nuwara Eliya"),
          full_name: "Roshan Bandara",
          nic: "199290123456",
          license_number: "LCN-NUE-001",
          phone_number: "0771234009",
          address: "5 Racecourse Road, Nuwara Eliya",
          status: "ACTIVE"
        },

        // Southern Province — Galle
        {
          district_id: getDistrictId("Galle"),
          full_name: "Isuru Madushanka",
          nic: "198901234567",
          license_number: "LCN-GAL-001",
          phone_number: "0771234010",
          address: "22 Fort Road, Galle",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Galle"),
          full_name: "Danushka Gunathilake",
          nic: "199312345678",
          license_number: "LCN-GAL-002",
          phone_number: "0771234011",
          address: "67 Hikkaduwa Road, Galle",
          status: "SUSPENDED"
        },

        // Southern Province — Matara
        {
          district_id: getDistrictId("Matara"),
          full_name: "Buddhika Pathirana",
          nic: "199023456780",
          license_number: "LCN-MTR-001",
          phone_number: "0771234012",
          address: "11 Weligama Road, Matara",
          status: "ACTIVE"
        },

        // Southern Province — Hambantota
        {
          district_id: getDistrictId("Hambantota"),
          full_name: "Sachith Kumara",
          nic: "198834567891",
          license_number: "LCN-HAM-001",
          phone_number: "0771234013",
          address: "33 Tangalle Road, Hambantota",
          status: "ACTIVE"
        },

        // Northern Province — Jaffna
        {
          district_id: getDistrictId("Jaffna"),
          full_name: "Arjunan Tharmalingam",
          nic: "199145678902",
          license_number: "LCN-JAF-001",
          phone_number: "0771234014",
          address: "14 Hospital Road, Jaffna",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Jaffna"),
          full_name: "Sutharsan Selvakumar",
          nic: "199256789013",
          license_number: "LCN-JAF-002",
          phone_number: "0771234015",
          address: "28 KKS Road, Jaffna",
          status: "ACTIVE"
        },

        // Northern Province — Vavuniya
        {
          district_id: getDistrictId("Vavuniya"),
          full_name: "Thileepan Krishnaraj",
          nic: "199067890124",
          license_number: "LCN-VAV-001",
          phone_number: "0771234016",
          address: "9 Horowpathana Road, Vavuniya",
          status: "ACTIVE"
        },

        // Eastern Province — Trincomalee
        {
          district_id: getDistrictId("Trincomalee"),
          full_name: "Mohamed Rilwan",
          nic: "198978901235",
          license_number: "LCN-TRI-001",
          phone_number: "0771234017",
          address: "41 Kandy Road, Trincomalee",
          status: "ACTIVE"
        },

        // Eastern Province — Batticaloa
        {
          district_id: getDistrictId("Batticaloa"),
          full_name: "Shankar Arunthavarajah",
          nic: "199389012346",
          license_number: "LCN-BAT-001",
          phone_number: "0771234018",
          address: "6 Bar Road, Batticaloa",
          status: "ACTIVE"
        },

        // Eastern Province — Ampara
        {
          district_id: getDistrictId("Ampara"),
          full_name: "Hassan Abdul Razack",
          nic: "199090123457",
          license_number: "LCN-AMP-001",
          phone_number: "0771234019",
          address: "19 Uhana Road, Ampara",
          status: "ACTIVE"
        },

        // North Western Province — Kurunegala
        {
          district_id: getDistrictId("Kurunegala"),
          full_name: "Dimuth Karunaratne",
          nic: "198801234568",
          license_number: "LCN-KUR-001",
          phone_number: "0771234020",
          address: "52 Colombo Road, Kurunegala",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kurunegala"),
          full_name: "Asela Gunawardena",
          nic: "199112345679",
          license_number: "LCN-KUR-002",
          phone_number: "0771234021",
          address: "77 Dambulla Road, Kurunegala",
          status: "INACTIVE"
        },

        // North Western Province — Puttalam
        {
          district_id: getDistrictId("Puttalam"),
          full_name: "Lahiru Thirimanne",
          nic: "199223456781",
          license_number: "LCN-PUT-001",
          phone_number: "0771234022",
          address: "3 Chilaw Road, Puttalam",
          status: "ACTIVE"
        },

        // North Central Province — Anuradhapura
        {
          district_id: getDistrictId("Anuradhapura"),
          full_name: "Jeewan Mendis",
          nic: "198934567892",
          license_number: "LCN-ANU-001",
          phone_number: "0771234023",
          address: "30 Mihintale Road, Anuradhapura",
          status: "ACTIVE"
        },

        // North Central Province — Polonnaruwa
        {
          district_id: getDistrictId("Polonnaruwa"),
          full_name: "Niroshan Dickwella",
          nic: "199345678903",
          license_number: "LCN-POL-001",
          phone_number: "0771234024",
          address: "8 Habarana Road, Polonnaruwa",
          status: "ACTIVE"
        },

        // Uva Province — Badulla
        {
          district_id: getDistrictId("Badulla"),
          full_name: "Kaushal Lokuarachchi",
          nic: "199056789014",
          license_number: "LCN-BAD-001",
          phone_number: "0771234025",
          address: "25 Bandarawela Road, Badulla",
          status: "ACTIVE"
        },

        // Uva Province — Monaragala
        {
          district_id: getDistrictId("Monaragala"),
          full_name: "Lakshan Sandakan",
          nic: "198867890126",
          license_number: "LCN-MON-001",
          phone_number: "0771234026",
          address: "14 Wellawaya Road, Monaragala",
          status: "ACTIVE"
        },

        // Sabaragamuwa Province — Ratnapura
        {
          district_id: getDistrictId("Ratnapura"),
          full_name: "Dushmantha Chameera",
          nic: "199178901237",
          license_number: "LCN-RAT-001",
          phone_number: "0771234027",
          address: "36 Colombo Road, Ratnapura",
          status: "ACTIVE"
        },

        // Sabaragamuwa Province — Kegalle
        {
          district_id: getDistrictId("Kegalle"),
          full_name: "Suranga Lakmal",
          nic: "199289012348",
          license_number: "LCN-KEG-001",
          phone_number: "0771234028",
          address: "61 Kandy Road, Kegalle",
          status: "ACTIVE"
        }
      ],
      { ignoreDuplicates: true }
    );

    console.log("28 drivers seeded successfully");
  } catch (err) {
    console.error("Error seeding drivers:", err);
  }
};

module.exports = seedDrivers;
