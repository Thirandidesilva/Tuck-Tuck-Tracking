const {
  createVehicleAssignment,
  getAllVehicleAssignments,
  getVehicleAssignmentById,
  updateVehicleAssignment,
  updateVehicleAssignmentStatus
} = require("../controllers/vehicleAssignment.controller");

const vehicleAssignmentRoutes = async (req, res, pathname, query) => {
  if (req.method === "POST" && pathname === "/api/v1/vehicle-assignments") {
    return createVehicleAssignment(req, res);
  }

  if (req.method === "GET" && pathname === "/api/v1/vehicle-assignments") {
    return getAllVehicleAssignments(req, res, query);
  }

  const assignmentMatch = pathname.match(/^\/api\/v1\/vehicle-assignments\/(\d+)$/);

  if (assignmentMatch) {
    const assignmentId = assignmentMatch[1];

    if (req.method === "GET") {
      return getVehicleAssignmentById(req, res, assignmentId);
    }

    if (req.method === "PATCH") {
      return updateVehicleAssignment(req, res, assignmentId);
    }
  }

  const statusMatch = pathname.match(/^\/api\/v1\/vehicle-assignments\/(\d+)\/status$/);

  if (statusMatch) {
    const assignmentId = statusMatch[1];

    if (req.method === "PATCH") {
      return updateVehicleAssignmentStatus(req, res, assignmentId);
    }
  }

  return false;
};

module.exports = vehicleAssignmentRoutes;