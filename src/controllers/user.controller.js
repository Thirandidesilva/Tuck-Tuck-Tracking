const { UserAccount, PoliceStation } = require("../models");
const sendJson = require("../utils/sendJson");
const { authorizeRoles } = require("../middleware/role.middleware");

const getRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const parsedBody = body ? JSON.parse(body) : {};
        resolve(parsedBody);
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", (error) => {
      reject(error);
    });
  });
};

const getAllUsers = async (req, res, query) => {
  try {
    const authResult = authorizeRoles(req, ["HQ_ADMIN", "SYSTEM_ADMIN"]);

    if (!authResult.success) {
      return sendJson(res, authResult.statusCode, {
        success: false,
        message: authResult.message,
      });
    }

    const users = await UserAccount.findAll({
      attributes: { exclude: ["password_hash"] },
      include: [
        {
          model: PoliceStation,
          as: "station",
          attributes: ["station_id", "station_name", "station_code"],
        },
      ],
      order: [["created_at", "ASC"]],
    });

    return sendJson(res, 200, {
      success: true,
      message: "Users fetched successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const getUserById = async (req, res, userId) => {
  try {
    const authResult = authorizeRoles(req, ["HQ_ADMIN", "SYSTEM_ADMIN"]);

    if (!authResult.success) {
      return sendJson(res, authResult.statusCode, {
        success: false,
        message: authResult.message,
      });
    }

    const user = await UserAccount.findByPk(userId, {
      attributes: { exclude: ["password_hash"] },
      include: [
        {
          model: PoliceStation,
          as: "station",
          attributes: ["station_id", "station_name", "station_code", "address"],
        },
      ],
    });

    if (!user) {
      return sendJson(res, 404, {
        success: false,
        message: "User not found",
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

const updateUserStatus = async (req, res, userId) => {
  try {
    const authResult = authorizeRoles(req, ["HQ_ADMIN", "SYSTEM_ADMIN"]);

    if (!authResult.success) {
      return sendJson(res, authResult.statusCode, {
        success: false,
        message: authResult.message,
      });
    }

    const body = await getRequestBody(req);
    const { account_status } = body;

    if (!account_status) {
      return sendJson(res, 400, {
        success: false,
        message: "account_status is required",
      });
    }

    const allowedStatuses = ["ACTIVE", "INACTIVE"];

    if (!allowedStatuses.includes(account_status)) {
      return sendJson(res, 400, {
        success: false,
        message: "Invalid account_status. Allowed values: ACTIVE, INACTIVE",
      });
    }

    const user = await UserAccount.findByPk(userId);

    if (!user) {
      return sendJson(res, 404, {
        success: false,
        message: "User not found",
      });
    }

    await user.update({ account_status });

    return sendJson(res, 200, {
      success: true,
      message: "User status updated successfully",
      data: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        account_status: user.account_status,
      },
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
};