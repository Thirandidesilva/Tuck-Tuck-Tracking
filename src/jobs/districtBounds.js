// Approximate geographic bounding boxes for each Sri Lanka district.
// Keyed by district_code matching the districts table.
// Format: { latMin, latMax, lngMin, lngMax }

const DISTRICT_BOUNDS = {
  // Western Province
  COL: { latMin: 6.850, latMax: 6.980, lngMin: 79.820, lngMax: 79.920 }, // Colombo
  GAM: { latMin: 6.950, latMax: 7.150, lngMin: 79.850, lngMax: 80.050 }, // Gampaha
  KLU: { latMin: 6.450, latMax: 6.850, lngMin: 79.850, lngMax: 80.150 }, // Kalutara

  // Central Province
  KAN: { latMin: 7.150, latMax: 7.450, lngMin: 80.550, lngMax: 80.750 }, // Kandy
  MAT: { latMin: 7.450, latMax: 7.750, lngMin: 80.550, lngMax: 80.800 }, // Matale
  NUE: { latMin: 6.850, latMax: 7.150, lngMin: 80.600, lngMax: 80.900 }, // Nuwara Eliya

  // Southern Province
  GAL: { latMin: 5.950, latMax: 6.300, lngMin: 79.950, lngMax: 80.350 }, // Galle
  MTR: { latMin: 5.900, latMax: 6.150, lngMin: 80.400, lngMax: 80.800 }, // Matara
  HAM: { latMin: 6.050, latMax: 6.450, lngMin: 80.800, lngMax: 81.300 }, // Hambantota

  // Northern Province
  JAF: { latMin: 9.500, latMax: 9.836, lngMin: 79.900, lngMax: 80.400 }, // Jaffna
  KIL: { latMin: 9.200, latMax: 9.500, lngMin: 80.200, lngMax: 80.500 }, // Kilinochchi
  MAN: { latMin: 8.850, latMax: 9.200, lngMin: 79.850, lngMax: 80.100 }, // Mannar
  MUL: { latMin: 8.900, latMax: 9.400, lngMin: 80.450, lngMax: 80.850 }, // Mullaitivu
  VAV: { latMin: 8.700, latMax: 8.950, lngMin: 80.300, lngMax: 80.650 }, // Vavuniya

  // Eastern Province
  TRI: { latMin: 8.300, latMax: 8.750, lngMin: 80.850, lngMax: 81.350 }, // Trincomalee
  BAT: { latMin: 7.550, latMax: 8.300, lngMin: 81.550, lngMax: 81.880 }, // Batticaloa
  AMP: { latMin: 7.150, latMax: 7.550, lngMin: 81.500, lngMax: 81.880 }, // Ampara

  // North Western Province
  KUR: { latMin: 7.500, latMax: 7.900, lngMin: 80.100, lngMax: 80.450 }, // Kurunegala
  PUT: { latMin: 7.900, latMax: 8.350, lngMin: 79.700, lngMax: 80.100 }, // Puttalam

  // North Central Province
  ANU: { latMin: 8.100, latMax: 8.500, lngMin: 80.250, lngMax: 80.700 }, // Anuradhapura
  POL: { latMin: 7.800, latMax: 8.100, lngMin: 80.800, lngMax: 81.150 }, // Polonnaruwa

  // Uva Province
  BAD: { latMin: 6.800, latMax: 7.200, lngMin: 80.900, lngMax: 81.250 }, // Badulla
  MON: { latMin: 6.550, latMax: 6.900, lngMin: 81.100, lngMax: 81.500 }, // Monaragala

  // Sabaragamuwa Province
  RAT: { latMin: 6.500, latMax: 6.850, lngMin: 80.250, lngMax: 80.700 }, // Ratnapura
  KEG: { latMin: 7.050, latMax: 7.400, lngMin: 80.250, lngMax: 80.550 }, // Kegalle
};

// Fallback — full Sri Lanka bounds used when the district code is unrecognised
const SRI_LANKA_BOUNDS = {
  latMin: 5.916,
  latMax: 9.836,
  lngMin: 79.652,
  lngMax: 81.879,
};

function getBoundsForDistrict(districtCode) {
  return DISTRICT_BOUNDS[districtCode] || SRI_LANKA_BOUNDS;
}

module.exports = { getBoundsForDistrict };
