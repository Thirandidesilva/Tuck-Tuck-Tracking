const { verifyToken } = require("../utils/jwt");

const authenticate = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      statusCode: 401,
      message: "Access token is missing or invalid",
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    return {
      success: true,
      user: decoded,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 401,
      message: "Invalid or expired token",
    };
  }
};

module.exports = {
  authenticate,
};