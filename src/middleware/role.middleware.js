const { authenticate } = require("./auth.middleware");

const authorizeRoles = (req, allowedRoles) => {
  const authResult = authenticate(req);

  if (!authResult.success) {
    return authResult;
  }

  if (!allowedRoles.includes(authResult.user.role)) {
    return {
      success: false,
      statusCode: 403,
      message: "You do not have permission to access this resource",
    };
  }

  return authResult;
};

module.exports = {
  authorizeRoles,
};