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
        {
          district_id: getDistrictId("Colombo"),
          full_name: "Kasun Jayasuriya",
          nic: "198550000002",
          license_number: "LCN-COL-003",
          phone_number: "0771234029",
          address: "67 Baseline Road, Colombo 09",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Colombo"),
          full_name: "Tharindu Perera",
          nic: "198650000004",
          license_number: "LCN-COL-004",
          phone_number: "0771234030",
          address: "15 Havelock Road, Colombo 05",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Colombo"),
          full_name: "Gayan Madusanka",
          nic: "198750000006",
          license_number: "LCN-COL-005",
          phone_number: "0771234031",
          address: "89 High Level Road, Colombo 06",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Colombo"),
          full_name: "Ruwan Serasinghe",
          nic: "198850000008",
          license_number: "LCN-COL-006",
          phone_number: "0771234032",
          address: "32 Duplication Road, Colombo 03",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Colombo"),
          full_name: "Chanaka Alwis",
          nic: "198950000010",
          license_number: "LCN-COL-007",
          phone_number: "0771234033",
          address: "54 Deans Road, Colombo 10",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Colombo"),
          full_name: "Namal Rajapaksa",
          nic: "199050000012",
          license_number: "LCN-COL-008",
          phone_number: "0771234034",
          address: "11 Ward Place, Colombo 07",
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
        {
          district_id: getDistrictId("Gampaha"),
          full_name: "Harsha Kumara",
          nic: "199150000014",
          license_number: "LCN-GAM-003",
          phone_number: "0771234035",
          address: "45 Yakkala Road, Gampaha",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Gampaha"),
          full_name: "Janaka Mendis",
          nic: "199250000016",
          license_number: "LCN-GAM-004",
          phone_number: "0771234036",
          address: "67 Minuwangoda Road, Gampaha",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Gampaha"),
          full_name: "Thusitha Silva",
          nic: "199350000018",
          license_number: "LCN-GAM-005",
          phone_number: "0771234037",
          address: "12 Wattala Road, Gampaha",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Gampaha"),
          full_name: "Udara Fernando",
          nic: "199450000020",
          license_number: "LCN-GAM-006",
          phone_number: "0771234038",
          address: "33 Ja-Ela Road, Gampaha",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Gampaha"),
          full_name: "Viraj Perera",
          nic: "199550000022",
          license_number: "LCN-GAM-007",
          phone_number: "0771234039",
          address: "8 Katunayake Road, Gampaha",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Gampaha"),
          full_name: "Sampath Dissanayake",
          nic: "199650000024",
          license_number: "LCN-GAM-008",
          phone_number: "0771234040",
          address: "56 Kelaniya Road, Gampaha",
          status: "SUSPENDED"
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
        {
          district_id: getDistrictId("Kalutara"),
          full_name: "Upul Kumara",
          nic: "199750000026",
          license_number: "LCN-KLU-002",
          phone_number: "0771234041",
          address: "23 Wadduwa Road, Kalutara",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kalutara"),
          full_name: "Nimal Bandara",
          nic: "199850000028",
          license_number: "LCN-KLU-003",
          phone_number: "0771234042",
          address: "45 Panadura Road, Kalutara",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kalutara"),
          full_name: "Gamini Siriwardena",
          nic: "199950000030",
          license_number: "LCN-KLU-004",
          phone_number: "0771234043",
          address: "67 Beruwala Road, Kalutara",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Kalutara"),
          full_name: "Mahesh Fernando",
          nic: "198550000032",
          license_number: "LCN-KLU-005",
          phone_number: "0771234044",
          address: "12 Aluthgama Road, Kalutara",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kalutara"),
          full_name: "Rajitha Wickramasinghe",
          nic: "198650000034",
          license_number: "LCN-KLU-006",
          phone_number: "0771234045",
          address: "34 Matugama Road, Kalutara",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kalutara"),
          full_name: "Sanjeewa Perera",
          nic: "198750000036",
          license_number: "LCN-KLU-007",
          phone_number: "0771234046",
          address: "78 Agalawatta Road, Kalutara",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kalutara"),
          full_name: "Dilshan Pathirana",
          nic: "198850000038",
          license_number: "LCN-KLU-008",
          phone_number: "0771234047",
          address: "9 Horana Road, Kalutara",
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
        {
          district_id: getDistrictId("Kandy"),
          full_name: "Thisara Randika",
          nic: "198950000040",
          license_number: "LCN-KAN-003",
          phone_number: "0771234048",
          address: "56 Ampitiya Road, Kandy",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kandy"),
          full_name: "Charith Bandara",
          nic: "199050000042",
          license_number: "LCN-KAN-004",
          phone_number: "0771234049",
          address: "23 Dharmaraja Road, Kandy",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kandy"),
          full_name: "Sajith Perera",
          nic: "199150000044",
          license_number: "LCN-KAN-005",
          phone_number: "0771234050",
          address: "45 Getambe Road, Kandy",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Kandy"),
          full_name: "Dilan Jayawardena",
          nic: "199250000046",
          license_number: "LCN-KAN-006",
          phone_number: "0771234051",
          address: "67 Anniewatte, Kandy",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kandy"),
          full_name: "Amila Rathnayake",
          nic: "199350000048",
          license_number: "LCN-KAN-007",
          phone_number: "0771234052",
          address: "12 Buwelikada Road, Kandy",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kandy"),
          full_name: "Hirantha Gunasekara",
          nic: "199450000050",
          license_number: "LCN-KAN-008",
          phone_number: "0771234053",
          address: "8 Lewella Road, Kandy",
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
        {
          district_id: getDistrictId("Matale"),
          full_name: "Chathura Abeywickrama",
          nic: "199550000052",
          license_number: "LCN-MAT-002",
          phone_number: "0771234054",
          address: "45 Dambulla Road, Matale",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Matale"),
          full_name: "Malinga Kumara",
          nic: "199650000054",
          license_number: "LCN-MAT-003",
          phone_number: "0771234055",
          address: "23 Naula Road, Matale",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Matale"),
          full_name: "Rangana Silva",
          nic: "199750000056",
          license_number: "LCN-MAT-004",
          phone_number: "0771234056",
          address: "67 Galewela Road, Matale",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Matale"),
          full_name: "Ajith Rathnayake",
          nic: "199850000058",
          license_number: "LCN-MAT-005",
          phone_number: "0771234057",
          address: "12 Rattota Road, Matale",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Matale"),
          full_name: "Prasad Jayasena",
          nic: "199950000060",
          license_number: "LCN-MAT-006",
          phone_number: "0771234058",
          address: "34 Ukuwela Road, Matale",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Matale"),
          full_name: "Dinesh Weerasinghe",
          nic: "198550000062",
          license_number: "LCN-MAT-007",
          phone_number: "0771234059",
          address: "56 Pallepola Road, Matale",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Matale"),
          full_name: "Madushan Senanayake",
          nic: "198650000064",
          license_number: "LCN-MAT-008",
          phone_number: "0771234060",
          address: "8 Yatawatta Road, Matale",
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
        {
          district_id: getDistrictId("Nuwara Eliya"),
          full_name: "Hasith Bandara",
          nic: "198750000066",
          license_number: "LCN-NUE-002",
          phone_number: "0771234061",
          address: "23 Gregory Lake Road, Nuwara Eliya",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Nuwara Eliya"),
          full_name: "Sanjaya Karunarathna",
          nic: "198850000068",
          license_number: "LCN-NUE-003",
          phone_number: "0771234062",
          address: "45 Badulla Road, Nuwara Eliya",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Nuwara Eliya"),
          full_name: "Tharaka Perera",
          nic: "198950000070",
          license_number: "LCN-NUE-004",
          phone_number: "0771234063",
          address: "67 Hatton Road, Nuwara Eliya",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Nuwara Eliya"),
          full_name: "Gishan Jayawardena",
          nic: "199050000072",
          license_number: "LCN-NUE-005",
          phone_number: "0771234064",
          address: "12 Kandy Road, Nuwara Eliya",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Nuwara Eliya"),
          full_name: "Prabath Kumara",
          nic: "199150000074",
          license_number: "LCN-NUE-006",
          phone_number: "0771234065",
          address: "34 New Bazaar Street, Nuwara Eliya",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Nuwara Eliya"),
          full_name: "Nilantha Rajapaksa",
          nic: "199250000076",
          license_number: "LCN-NUE-007",
          phone_number: "0771234066",
          address: "56 Mahagastota Road, Nuwara Eliya",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Nuwara Eliya"),
          full_name: "Aruna Fernando",
          nic: "199350000078",
          license_number: "LCN-NUE-008",
          phone_number: "0771234067",
          address: "8 Woodlands Road, Nuwara Eliya",
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
        {
          district_id: getDistrictId("Galle"),
          full_name: "Kavinda Madushanka",
          nic: "199450000080",
          license_number: "LCN-GAL-003",
          phone_number: "0771234068",
          address: "45 Unawatuna Road, Galle",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Galle"),
          full_name: "Eranga Wickramasinghe",
          nic: "199550000082",
          license_number: "LCN-GAL-004",
          phone_number: "0771234069",
          address: "23 Magalle Road, Galle",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Galle"),
          full_name: "Shehan Fernando",
          nic: "199650000084",
          license_number: "LCN-GAL-005",
          phone_number: "0771234070",
          address: "67 Baddegama Road, Galle",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Galle"),
          full_name: "Nuwan Jayasuriya",
          nic: "199750000086",
          license_number: "LCN-GAL-006",
          phone_number: "0771234071",
          address: "12 Ambalangoda Road, Galle",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Galle"),
          full_name: "Lakmina Perera",
          nic: "199850000088",
          license_number: "LCN-GAL-007",
          phone_number: "0771234072",
          address: "34 Thalapitiya Road, Galle",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Galle"),
          full_name: "Rasika Bandara",
          nic: "199950000090",
          license_number: "LCN-GAL-008",
          phone_number: "0771234073",
          address: "56 Wakwella Road, Galle",
          status: "ACTIVE"
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
        {
          district_id: getDistrictId("Matara"),
          full_name: "Dilhara Silva",
          nic: "198550000092",
          license_number: "LCN-MTR-002",
          phone_number: "0771234074",
          address: "45 Akuressa Road, Matara",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Matara"),
          full_name: "Vindika Perera",
          nic: "198650000094",
          license_number: "LCN-MTR-003",
          phone_number: "0771234075",
          address: "23 Dickwella Road, Matara",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Matara"),
          full_name: "Thilanka Rathnayake",
          nic: "198750000096",
          license_number: "LCN-MTR-004",
          phone_number: "0771234076",
          address: "67 Hakmana Road, Matara",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Matara"),
          full_name: "Ishan Jayawardena",
          nic: "198850000098",
          license_number: "LCN-MTR-005",
          phone_number: "0771234077",
          address: "12 Deniyaya Road, Matara",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Matara"),
          full_name: "Asanka Fernando",
          nic: "198950000100",
          license_number: "LCN-MTR-006",
          phone_number: "0771234078",
          address: "34 Kotapola Road, Matara",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Matara"),
          full_name: "Sachindra Kumara",
          nic: "199050000102",
          license_number: "LCN-MTR-007",
          phone_number: "0771234079",
          address: "56 Malimbada Road, Matara",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Matara"),
          full_name: "Nipun Dissanayake",
          nic: "199150000104",
          license_number: "LCN-MTR-008",
          phone_number: "0771234080",
          address: "8 Kekanadura Road, Matara",
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
        {
          district_id: getDistrictId("Hambantota"),
          full_name: "Bhanuka Rajapaksa",
          nic: "199250000106",
          license_number: "LCN-HAM-002",
          phone_number: "0771234081",
          address: "45 Sooriyawewa Road, Hambantota",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Hambantota"),
          full_name: "Dinuka Perera",
          nic: "199350000108",
          license_number: "LCN-HAM-003",
          phone_number: "0771234082",
          address: "23 Tissamaharama Road, Hambantota",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Hambantota"),
          full_name: "Kavindu Silva",
          nic: "199450000110",
          license_number: "LCN-HAM-004",
          phone_number: "0771234083",
          address: "67 Ambalantota Road, Hambantota",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Hambantota"),
          full_name: "Sahan Fernando",
          nic: "199550000112",
          license_number: "LCN-HAM-005",
          phone_number: "0771234084",
          address: "12 Beliatta Road, Hambantota",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Hambantota"),
          full_name: "Akila Gunasekara",
          nic: "199650000114",
          license_number: "LCN-HAM-006",
          phone_number: "0771234085",
          address: "34 Weeraketiya Road, Hambantota",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Hambantota"),
          full_name: "Dulaj Bandara",
          nic: "199750000116",
          license_number: "LCN-HAM-007",
          phone_number: "0771234086",
          address: "56 Katuwana Road, Hambantota",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Hambantota"),
          full_name: "Waruna Wickramasinghe",
          nic: "199850000118",
          license_number: "LCN-HAM-008",
          phone_number: "0771234087",
          address: "8 Lunugamvehera Road, Hambantota",
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
        {
          district_id: getDistrictId("Jaffna"),
          full_name: "Rajan Sivananthan",
          nic: "199950000120",
          license_number: "LCN-JAF-003",
          phone_number: "0771234088",
          address: "45 Nallur Road, Jaffna",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Jaffna"),
          full_name: "Kumar Nallainathan",
          nic: "198550000122",
          license_number: "LCN-JAF-004",
          phone_number: "0771234089",
          address: "23 Point Pedro Road, Jaffna",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Jaffna"),
          full_name: "Suresh Mahendran",
          nic: "198650000124",
          license_number: "LCN-JAF-005",
          phone_number: "0771234090",
          address: "67 Chundikuli Road, Jaffna",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Jaffna"),
          full_name: "Vijay Thevarajah",
          nic: "198750000126",
          license_number: "LCN-JAF-006",
          phone_number: "0771234091",
          address: "12 Ponnalai Road, Jaffna",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Jaffna"),
          full_name: "Murali Sivasubramaniam",
          nic: "198850000128",
          license_number: "LCN-JAF-007",
          phone_number: "0771234092",
          address: "34 Navanthurai Road, Jaffna",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Jaffna"),
          full_name: "Selvam Karunananthan",
          nic: "198950000130",
          license_number: "LCN-JAF-008",
          phone_number: "0771234093",
          address: "56 Kopay Road, Jaffna",
          status: "ACTIVE"
        },

        // Northern Province — Kilinochchi
        {
          district_id: getDistrictId("Kilinochchi"),
          full_name: "Piratheepan Rajendran",
          nic: "199050000132",
          license_number: "LCN-KIL-001",
          phone_number: "0771234177",
          address: "15 Kandy Road, Kilinochchi",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kilinochchi"),
          full_name: "Logeswaran Maheswaran",
          nic: "199150000134",
          license_number: "LCN-KIL-002",
          phone_number: "0771234178",
          address: "32 Paranthan Road, Kilinochchi",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kilinochchi"),
          full_name: "Shanthan Sivakumar",
          nic: "199250000136",
          license_number: "LCN-KIL-003",
          phone_number: "0771234179",
          address: "48 Iranamadu Road, Kilinochchi",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kilinochchi"),
          full_name: "Thushyanthan Karunakaran",
          nic: "199350000138",
          license_number: "LCN-KIL-004",
          phone_number: "0771234180",
          address: "67 Pooneryn Road, Kilinochchi",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Kilinochchi"),
          full_name: "Uthayakumar Sivarajah",
          nic: "199450000140",
          license_number: "LCN-KIL-005",
          phone_number: "0771234181",
          address: "12 Mullaitivu Road, Kilinochchi",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kilinochchi"),
          full_name: "Varatharajah Nadarajah",
          nic: "199550000142",
          license_number: "LCN-KIL-006",
          phone_number: "0771234182",
          address: "25 Mannar Road, Kilinochchi",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kilinochchi"),
          full_name: "Wigneshwaran Sivapalan",
          nic: "199650000144",
          license_number: "LCN-KIL-007",
          phone_number: "0771234183",
          address: "39 Pallai Road, Kilinochchi",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kilinochchi"),
          full_name: "Pratheepan Nadesan",
          nic: "199750000146",
          license_number: "LCN-KIL-008",
          phone_number: "0771234184",
          address: "8 Uruthirapuram Road, Kilinochchi",
          status: "ACTIVE"
        },

        // Northern Province — Mannar
        {
          district_id: getDistrictId("Mannar"),
          full_name: "Anto Mariyathas",
          nic: "199850000148",
          license_number: "LCN-MAN-001",
          phone_number: "0771234185",
          address: "14 Mannar Town Road, Mannar",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Mannar"),
          full_name: "Balaraj Sebastiampillai",
          nic: "199950000150",
          license_number: "LCN-MAN-002",
          phone_number: "0771234186",
          address: "28 Vavuniya Road, Mannar",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Mannar"),
          full_name: "Charles Antonipillai",
          nic: "198550000152",
          license_number: "LCN-MAN-003",
          phone_number: "0771234187",
          address: "45 Pesalai Road, Mannar",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Mannar"),
          full_name: "Dharmaraj Antonythasan",
          nic: "198650000154",
          license_number: "LCN-MAN-004",
          phone_number: "0771234188",
          address: "23 Talaimannar Road, Mannar",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Mannar"),
          full_name: "Emmanuel Rajasekaran",
          nic: "198750000156",
          license_number: "LCN-MAN-005",
          phone_number: "0771234189",
          address: "67 Murunkan Road, Mannar",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Mannar"),
          full_name: "Francis Ferdinando",
          nic: "198850000158",
          license_number: "LCN-MAN-006",
          phone_number: "0771234190",
          address: "12 Silavathurai Road, Mannar",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Mannar"),
          full_name: "George Mariyadas",
          nic: "198950000160",
          license_number: "LCN-MAN-007",
          phone_number: "0771234191",
          address: "34 Adampan Road, Mannar",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Mannar"),
          full_name: "Henrick Antonysamy",
          nic: "199050000162",
          license_number: "LCN-MAN-008",
          phone_number: "0771234192",
          address: "56 Vankalai Road, Mannar",
          status: "ACTIVE"
        },

        // Northern Province — Mullaitivu
        {
          district_id: getDistrictId("Mullaitivu"),
          full_name: "Iraianbu Nadarajah",
          nic: "199150000164",
          license_number: "LCN-MUL-001",
          phone_number: "0771234193",
          address: "15 Oddusuddan Road, Mullaitivu",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Mullaitivu"),
          full_name: "Jeyakumar Krishnarajah",
          nic: "199250000166",
          license_number: "LCN-MUL-002",
          phone_number: "0771234194",
          address: "32 Puthukudiyiruppu Road, Mullaitivu",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Mullaitivu"),
          full_name: "Kajeepan Thillainathan",
          nic: "199350000168",
          license_number: "LCN-MUL-003",
          phone_number: "0771234195",
          address: "48 Thunukkai Road, Mullaitivu",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Mullaitivu"),
          full_name: "Lingeswaran Balakrishnan",
          nic: "199450000170",
          license_number: "LCN-MUL-004",
          phone_number: "0771234196",
          address: "67 Mankulam Road, Mullaitivu",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Mullaitivu"),
          full_name: "Mathiyalagan Ragunathan",
          nic: "199550000172",
          license_number: "LCN-MUL-005",
          phone_number: "0771234197",
          address: "12 Mullaitivu Town Road, Mullaitivu",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Mullaitivu"),
          full_name: "Nirujan Navaratnam",
          nic: "199650000174",
          license_number: "LCN-MUL-006",
          phone_number: "0771234198",
          address: "25 Kokkilai Road, Mullaitivu",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Mullaitivu"),
          full_name: "Obalasingam Thangarajah",
          nic: "199750000176",
          license_number: "LCN-MUL-007",
          phone_number: "0771234199",
          address: "39 Nayaru Road, Mullaitivu",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Mullaitivu"),
          full_name: "Piratheeban Subramaniam",
          nic: "199850000178",
          license_number: "LCN-MUL-008",
          phone_number: "0771234200",
          address: "8 Alampil Road, Mullaitivu",
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
        {
          district_id: getDistrictId("Vavuniya"),
          full_name: "Nandhan Karnan",
          nic: "199950000180",
          license_number: "LCN-VAV-002",
          phone_number: "0771234094",
          address: "23 Kandy Road, Vavuniya",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Vavuniya"),
          full_name: "Kumaran Tharmarajah",
          nic: "198550000182",
          license_number: "LCN-VAV-003",
          phone_number: "0771234095",
          address: "45 Mullaitivu Road, Vavuniya",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Vavuniya"),
          full_name: "Sivashankar Balasundaram",
          nic: "198650000184",
          license_number: "LCN-VAV-004",
          phone_number: "0771234096",
          address: "67 Nedunkerny Road, Vavuniya",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Vavuniya"),
          full_name: "Thevaraj Nadarajah",
          nic: "198750000186",
          license_number: "LCN-VAV-005",
          phone_number: "0771234097",
          address: "12 Mannar Road, Vavuniya",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Vavuniya"),
          full_name: "Mahendran Ratnasabapathy",
          nic: "198850000188",
          license_number: "LCN-VAV-006",
          phone_number: "0771234098",
          address: "34 Cheddikulam Road, Vavuniya",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Vavuniya"),
          full_name: "Balasubramaniam Arulraj",
          nic: "198950000190",
          license_number: "LCN-VAV-007",
          phone_number: "0771234099",
          address: "56 Omanthai Road, Vavuniya",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Vavuniya"),
          full_name: "Ragunathan Sivanantham",
          nic: "199050000192",
          license_number: "LCN-VAV-008",
          phone_number: "0771234100",
          address: "8 Paranthan Road, Vavuniya",
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
        {
          district_id: getDistrictId("Trincomalee"),
          full_name: "Farook Mohamed Nazeer",
          nic: "199150000194",
          license_number: "LCN-TRI-002",
          phone_number: "0771234101",
          address: "23 Dockyard Road, Trincomalee",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Trincomalee"),
          full_name: "Rizwi Abdul Hameed",
          nic: "199250000196",
          license_number: "LCN-TRI-003",
          phone_number: "0771234102",
          address: "45 Fort Frederick Road, Trincomalee",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Trincomalee"),
          full_name: "Imran Mohamed Ismail",
          nic: "199350000198",
          license_number: "LCN-TRI-004",
          phone_number: "0771234103",
          address: "67 Trinco Road, Trincomalee",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Trincomalee"),
          full_name: "Nizar Ahamed",
          nic: "199450000200",
          license_number: "LCN-TRI-005",
          phone_number: "0771234104",
          address: "12 Sangamankanda Road, Trincomalee",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Trincomalee"),
          full_name: "Rehan Mohideen",
          nic: "199550000202",
          license_number: "LCN-TRI-006",
          phone_number: "0771234105",
          address: "34 China Bay Road, Trincomalee",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Trincomalee"),
          full_name: "Zaid Mohamed Farook",
          nic: "199650000204",
          license_number: "LCN-TRI-007",
          phone_number: "0771234106",
          address: "56 Nilaveli Road, Trincomalee",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Trincomalee"),
          full_name: "Ashroff Mohideen",
          nic: "199750000206",
          license_number: "LCN-TRI-008",
          phone_number: "0771234107",
          address: "8 Muttur Road, Trincomalee",
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
        {
          district_id: getDistrictId("Batticaloa"),
          full_name: "Jegan Arulampalam",
          nic: "199850000208",
          license_number: "LCN-BAT-002",
          phone_number: "0771234108",
          address: "23 Kalmunai Road, Batticaloa",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Batticaloa"),
          full_name: "Thayaparan Sivagnanasundaram",
          nic: "199950000210",
          license_number: "LCN-BAT-003",
          phone_number: "0771234109",
          address: "45 Eravur Road, Batticaloa",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Batticaloa"),
          full_name: "Ravindran Sittampalam",
          nic: "198550000212",
          license_number: "LCN-BAT-004",
          phone_number: "0771234110",
          address: "67 Valaichenai Road, Batticaloa",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Batticaloa"),
          full_name: "Kanagaratnam Kandaiah",
          nic: "198650000214",
          license_number: "LCN-BAT-005",
          phone_number: "0771234111",
          address: "12 Chenkalady Road, Batticaloa",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Batticaloa"),
          full_name: "Nadarajah Selvarajah",
          nic: "198750000216",
          license_number: "LCN-BAT-006",
          phone_number: "0771234112",
          address: "34 Koddaikallar Road, Batticaloa",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Batticaloa"),
          full_name: "Thambipillai Ratnasabapathy",
          nic: "198850000218",
          license_number: "LCN-BAT-007",
          phone_number: "0771234113",
          address: "56 Oddamavadi Road, Batticaloa",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Batticaloa"),
          full_name: "Muththulingam Veluppillai",
          nic: "198950000220",
          license_number: "LCN-BAT-008",
          phone_number: "0771234114",
          address: "8 Kathiraveli Road, Batticaloa",
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
        {
          district_id: getDistrictId("Ampara"),
          full_name: "Mohamed Farook",
          nic: "199050000222",
          license_number: "LCN-AMP-002",
          phone_number: "0771234115",
          address: "23 Akkaraipattu Road, Ampara",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Ampara"),
          full_name: "Abdul Careem",
          nic: "199150000224",
          license_number: "LCN-AMP-003",
          phone_number: "0771234116",
          address: "45 Sammanthurai Road, Ampara",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Ampara"),
          full_name: "Nizam Mohamed",
          nic: "199250000226",
          license_number: "LCN-AMP-004",
          phone_number: "0771234117",
          address: "67 Kalmunai Road, Ampara",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Ampara"),
          full_name: "Farhan Mohideen",
          nic: "199350000228",
          license_number: "LCN-AMP-005",
          phone_number: "0771234118",
          address: "12 Mahaoya Road, Ampara",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Ampara"),
          full_name: "Musthafa Ibrahim",
          nic: "199450000230",
          license_number: "LCN-AMP-006",
          phone_number: "0771234119",
          address: "34 Padiyathalawa Road, Ampara",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Ampara"),
          full_name: "Saleem Abdul Razak",
          nic: "199550000232",
          license_number: "LCN-AMP-007",
          phone_number: "0771234120",
          address: "56 Addalaichenai Road, Ampara",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Ampara"),
          full_name: "Rizvi Ismail",
          nic: "199650000234",
          license_number: "LCN-AMP-008",
          phone_number: "0771234121",
          address: "8 Nintavur Road, Ampara",
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
        {
          district_id: getDistrictId("Kurunegala"),
          full_name: "Chaminda Bandara",
          nic: "199750000236",
          license_number: "LCN-KUR-003",
          phone_number: "0771234122",
          address: "34 Puttalam Road, Kurunegala",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kurunegala"),
          full_name: "Nuwantha Perera",
          nic: "199850000238",
          license_number: "LCN-KUR-004",
          phone_number: "0771234123",
          address: "56 Kandy Road, Kurunegala",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kurunegala"),
          full_name: "Isanka Silva",
          nic: "199950000240",
          license_number: "LCN-KUR-005",
          phone_number: "0771234124",
          address: "23 Wariyapola Road, Kurunegala",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kurunegala"),
          full_name: "Prabhath Jayasena",
          nic: "198550000242",
          license_number: "LCN-KUR-006",
          phone_number: "0771234125",
          address: "67 Mawathagama Road, Kurunegala",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kurunegala"),
          full_name: "Sanjula Fernando",
          nic: "198650000244",
          license_number: "LCN-KUR-007",
          phone_number: "0771234126",
          address: "12 Giriulla Road, Kurunegala",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Kurunegala"),
          full_name: "Thilina Rathnayake",
          nic: "198750000246",
          license_number: "LCN-KUR-008",
          phone_number: "0771234127",
          address: "45 Nikaweratiya Road, Kurunegala",
          status: "ACTIVE"
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
        {
          district_id: getDistrictId("Puttalam"),
          full_name: "Achira Perera",
          nic: "198850000248",
          license_number: "LCN-PUT-002",
          phone_number: "0771234128",
          address: "23 Colombo Road, Puttalam",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Puttalam"),
          full_name: "Devinda Silva",
          nic: "198950000250",
          license_number: "LCN-PUT-003",
          phone_number: "0771234129",
          address: "45 Wennappuwa Road, Puttalam",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Puttalam"),
          full_name: "Charuka Jayawardena",
          nic: "199050000252",
          license_number: "LCN-PUT-004",
          phone_number: "0771234130",
          address: "67 Anamaduwa Road, Puttalam",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Puttalam"),
          full_name: "Harindra Fernando",
          nic: "199150000254",
          license_number: "LCN-PUT-005",
          phone_number: "0771234131",
          address: "12 Mundel Road, Puttalam",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Puttalam"),
          full_name: "Janitha Kumara",
          nic: "199250000256",
          license_number: "LCN-PUT-006",
          phone_number: "0771234132",
          address: "34 Marawila Road, Puttalam",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Puttalam"),
          full_name: "Kasun Bandara",
          nic: "199350000258",
          license_number: "LCN-PUT-007",
          phone_number: "0771234133",
          address: "56 Nawagattegama Road, Puttalam",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Puttalam"),
          full_name: "Lahiru Dissanayake",
          nic: "199450000260",
          license_number: "LCN-PUT-008",
          phone_number: "0771234134",
          address: "8 Dankotuwa Road, Puttalam",
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
        {
          district_id: getDistrictId("Anuradhapura"),
          full_name: "Malinda Kumara",
          nic: "199550000262",
          license_number: "LCN-ANU-002",
          phone_number: "0771234135",
          address: "23 Polonnaruwa Road, Anuradhapura",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Anuradhapura"),
          full_name: "Nishan Perera",
          nic: "199650000264",
          license_number: "LCN-ANU-003",
          phone_number: "0771234136",
          address: "45 Kekirawa Road, Anuradhapura",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Anuradhapura"),
          full_name: "Oshan Fernando",
          nic: "199750000266",
          license_number: "LCN-ANU-004",
          phone_number: "0771234137",
          address: "67 Medawachchiya Road, Anuradhapura",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Anuradhapura"),
          full_name: "Pasan Silva",
          nic: "199850000268",
          license_number: "LCN-ANU-005",
          phone_number: "0771234138",
          address: "12 Horowpathana Road, Anuradhapura",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Anuradhapura"),
          full_name: "Qasim Mohamed",
          nic: "199950000270",
          license_number: "LCN-ANU-006",
          phone_number: "0771234139",
          address: "34 Vavuniya Road, Anuradhapura",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Anuradhapura"),
          full_name: "Ravindu Jayawardena",
          nic: "198550000272",
          license_number: "LCN-ANU-007",
          phone_number: "0771234140",
          address: "56 Kebithigollewa Road, Anuradhapura",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Anuradhapura"),
          full_name: "Sandun Rathnayake",
          nic: "198650000274",
          license_number: "LCN-ANU-008",
          phone_number: "0771234141",
          address: "8 Galenbindunuwewa Road, Anuradhapura",
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
        {
          district_id: getDistrictId("Polonnaruwa"),
          full_name: "Tharaka Silva",
          nic: "198750000276",
          license_number: "LCN-POL-002",
          phone_number: "0771234142",
          address: "23 Minneriya Road, Polonnaruwa",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Polonnaruwa"),
          full_name: "Udaya Kumara",
          nic: "198850000278",
          license_number: "LCN-POL-003",
          phone_number: "0771234143",
          address: "45 Medirigiriya Road, Polonnaruwa",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Polonnaruwa"),
          full_name: "Vimukthi Bandara",
          nic: "198950000280",
          license_number: "LCN-POL-004",
          phone_number: "0771234144",
          address: "67 Kaduruwela Road, Polonnaruwa",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Polonnaruwa"),
          full_name: "Wanusha Fernando",
          nic: "199050000282",
          license_number: "LCN-POL-005",
          phone_number: "0771234145",
          address: "12 Hingurakgoda Road, Polonnaruwa",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Polonnaruwa"),
          full_name: "Yasas Jayasena",
          nic: "199150000284",
          license_number: "LCN-POL-006",
          phone_number: "0771234146",
          address: "34 Dimbulagala Road, Polonnaruwa",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Polonnaruwa"),
          full_name: "Achala Perera",
          nic: "199250000286",
          license_number: "LCN-POL-007",
          phone_number: "0771234147",
          address: "56 Lankapura Road, Polonnaruwa",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Polonnaruwa"),
          full_name: "Binara Dissanayake",
          nic: "199350000288",
          license_number: "LCN-POL-008",
          phone_number: "0771234148",
          address: "8 Aralaganwila Road, Polonnaruwa",
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
        {
          district_id: getDistrictId("Badulla"),
          full_name: "Chiran Fernando",
          nic: "199450000290",
          license_number: "LCN-BAD-002",
          phone_number: "0771234149",
          address: "23 Mahiyanganaya Road, Badulla",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Badulla"),
          full_name: "Dasun Silva",
          nic: "199550000292",
          license_number: "LCN-BAD-003",
          phone_number: "0771234150",
          address: "45 Passara Road, Badulla",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Badulla"),
          full_name: "Eranda Kumara",
          nic: "199650000294",
          license_number: "LCN-BAD-004",
          phone_number: "0771234151",
          address: "67 Ella Road, Badulla",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Badulla"),
          full_name: "Filan Jayawardena",
          nic: "199750000296",
          license_number: "LCN-BAD-005",
          phone_number: "0771234152",
          address: "12 Hali-Ela Road, Badulla",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Badulla"),
          full_name: "Gihantha Perera",
          nic: "199850000298",
          license_number: "LCN-BAD-006",
          phone_number: "0771234153",
          address: "34 Diyathalawa Road, Badulla",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Badulla"),
          full_name: "Hashith Bandara",
          nic: "199950000300",
          license_number: "LCN-BAD-007",
          phone_number: "0771234154",
          address: "56 Welimada Road, Badulla",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Badulla"),
          full_name: "Iresh Rathnayake",
          nic: "198550000302",
          license_number: "LCN-BAD-008",
          phone_number: "0771234155",
          address: "8 Haputale Road, Badulla",
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
        {
          district_id: getDistrictId("Monaragala"),
          full_name: "Janith Kumara",
          nic: "198650000304",
          license_number: "LCN-MON-002",
          phone_number: "0771234156",
          address: "23 Bibile Road, Monaragala",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Monaragala"),
          full_name: "Kavinda Perera",
          nic: "198750000306",
          license_number: "LCN-MON-003",
          phone_number: "0771234157",
          address: "45 Buttala Road, Monaragala",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Monaragala"),
          full_name: "Lahiru Silva",
          nic: "198850000308",
          license_number: "LCN-MON-004",
          phone_number: "0771234158",
          address: "67 Siyambalanduwa Road, Monaragala",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Monaragala"),
          full_name: "Maduranga Fernando",
          nic: "198950000310",
          license_number: "LCN-MON-005",
          phone_number: "0771234159",
          address: "12 Medagama Road, Monaragala",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Monaragala"),
          full_name: "Naveendra Jayawardena",
          nic: "199050000312",
          license_number: "LCN-MON-006",
          phone_number: "0771234160",
          address: "34 Kataragama Road, Monaragala",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Monaragala"),
          full_name: "Oshadha Bandara",
          nic: "199150000314",
          license_number: "LCN-MON-007",
          phone_number: "0771234161",
          address: "56 Moneragala Town Road, Monaragala",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Monaragala"),
          full_name: "Pasidu Dissanayake",
          nic: "199250000316",
          license_number: "LCN-MON-008",
          phone_number: "0771234162",
          address: "8 Ampara Road, Monaragala",
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
        {
          district_id: getDistrictId("Ratnapura"),
          full_name: "Ranmith Perera",
          nic: "199350000318",
          license_number: "LCN-RAT-002",
          phone_number: "0771234163",
          address: "23 Embilipitiya Road, Ratnapura",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Ratnapura"),
          full_name: "Savin Silva",
          nic: "199450000320",
          license_number: "LCN-RAT-003",
          phone_number: "0771234164",
          address: "45 Kahawatta Road, Ratnapura",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Ratnapura"),
          full_name: "Thilinika Kumara",
          nic: "199550000322",
          license_number: "LCN-RAT-004",
          phone_number: "0771234165",
          address: "67 Balangoda Road, Ratnapura",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Ratnapura"),
          full_name: "Ushan Fernando",
          nic: "199650000324",
          license_number: "LCN-RAT-005",
          phone_number: "0771234166",
          address: "12 Pelmadulla Road, Ratnapura",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Ratnapura"),
          full_name: "Viran Jayawardena",
          nic: "199750000326",
          license_number: "LCN-RAT-006",
          phone_number: "0771234167",
          address: "34 Eheliyagoda Road, Ratnapura",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Ratnapura"),
          full_name: "Wathsala Bandara",
          nic: "199850000328",
          license_number: "LCN-RAT-007",
          phone_number: "0771234168",
          address: "56 Kuruwita Road, Ratnapura",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Ratnapura"),
          full_name: "Yasiru Rathnayake",
          nic: "199950000330",
          license_number: "LCN-RAT-008",
          phone_number: "0771234169",
          address: "8 Nivithigala Road, Ratnapura",
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
        },
        {
          district_id: getDistrictId("Kegalle"),
          full_name: "Achintha Perera",
          nic: "198550000332",
          license_number: "LCN-KEG-002",
          phone_number: "0771234170",
          address: "23 Warakapola Road, Kegalle",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kegalle"),
          full_name: "Bimantha Silva",
          nic: "198650000334",
          license_number: "LCN-KEG-003",
          phone_number: "0771234171",
          address: "45 Mawanella Road, Kegalle",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kegalle"),
          full_name: "Chanula Fernando",
          nic: "198750000336",
          license_number: "LCN-KEG-004",
          phone_number: "0771234172",
          address: "67 Rambukkana Road, Kegalle",
          status: "INACTIVE"
        },
        {
          district_id: getDistrictId("Kegalle"),
          full_name: "Dinura Kumara",
          nic: "198850000338",
          license_number: "LCN-KEG-005",
          phone_number: "0771234173",
          address: "12 Galigamuwa Road, Kegalle",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kegalle"),
          full_name: "Eshan Jayawardena",
          nic: "198950000340",
          license_number: "LCN-KEG-006",
          phone_number: "0771234174",
          address: "34 Yatiyantota Road, Kegalle",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kegalle"),
          full_name: "Fawzan Mohamed",
          nic: "199050000342",
          license_number: "LCN-KEG-007",
          phone_number: "0771234175",
          address: "56 Deraniyagala Road, Kegalle",
          status: "ACTIVE"
        },
        {
          district_id: getDistrictId("Kegalle"),
          full_name: "Gishantha Bandara",
          nic: "199150000344",
          license_number: "LCN-KEG-008",
          phone_number: "0771234176",
          address: "8 Bulathkohupitiya Road, Kegalle",
          status: "ACTIVE"
        }
      ],
      { ignoreDuplicates: true }
    );

    console.log("200 drivers seeded successfully");
  } catch (err) {
    console.error("Error seeding drivers:", err);
  }
};

module.exports = seedDrivers;
