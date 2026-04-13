const authenticate = (req) => {
  if (req.user) {
    return { success: true, user: req.user };
  }

  return {
    success: false,
    statusCode: 401,
    message: "Access token is missing or invalid",
  };
};

module.exports = { authenticate };