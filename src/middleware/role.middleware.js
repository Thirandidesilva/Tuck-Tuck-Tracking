const authorizeRoles = (req, allowedRoles) => {
  if (!req.user) {
    return {
      success: false,
      statusCode: 401,
      message: "Access token is missing or invalid",
    };
  }

  if (!allowedRoles.includes(req.user.role)) {
    return {
      success: false,
      statusCode: 403,
      message: "You do not have permission to access this resource",
    };
  }

  return { success: true, user: req.user };
};

module.exports = { authorizeRoles };
