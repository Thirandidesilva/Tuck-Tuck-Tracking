const bcrypt = require("bcrypt");
const { UserAccount, PoliceStation } = require("../models");
const { generateToken } = require("../utils/jwt");
const { authenticate } = require("../middleware/auth.middleware");
const parseBody = require("../utils/parseBody");
const sendJson = require("../utils/sendJson");

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

const registerUser = async (req, res) => {
  try {
    const body = await getRequestBody(req);
    const {
      full_name,
      email,
      password,
      role,
      station_id,
      account_status,
    } = body;

    if (!full_name || !email || !password || !role) {
      return sendJson(res, 400, {
        success: false,
        message: "full_name, email, password, and role are required",
      });
    }

    const existingUser = await UserAccount.findOne({
      where: { email },
    });

    if (existingUser) {
      return sendJson(res, 409, {
        success: false,
        message: "Email already exists",
      });
    }

    const stationRoles = ["STATION_OFFICER"];

    if (stationRoles.includes(role) && !station_id) {
      return sendJson(res, 400, {
        success: false,
        message: "station_id is required for station-level users",
      });
    }

    if (station_id) {
      const station = await PoliceStation.findByPk(station_id);

      if (!station) {
        return sendJson(res, 404, {
          success: false,
          message: "Referenced police station not found",
        });
      }
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await UserAccount.create({
      full_name,
      email,
      password_hash,
      role,
      station_id: station_id || null,
      account_status: account_status || "ACTIVE",
    });

    return sendJson(res, 201, {
      success: true,
      message: "User registered successfully",
      data: {
        user_id: newUser.user_id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        station_id: newUser.station_id,
        account_status: newUser.account_status,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const body = await getRequestBody(req);
    const { email, password } = body;

    if (!email || !password) {
      return sendJson(res, 400, {
        success: false,
        message: "email and password are required",
      });
    }

    const user = await UserAccount.findOne({
      where: { email },
      include: [
        {
          model: PoliceStation,
          as: "station",
          attributes: ["station_id", "station_name", "station_code"],
        },
      ],
    });

    if (!user) {
      return sendJson(res, 401, {
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.account_status !== "ACTIVE") {
      return sendJson(res, 403, {
        success: false,
        message: "User account is inactive",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return sendJson(res, 401, {
        success: false,
        message: "Invalid email or password",
      });
    }

    const currentTime = new Date();

    await user.update({
      last_login_at: currentTime,
    });

    const token = generateToken({
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    });

    return sendJson(res, 200, {
      success: true,
      message: "Login successful",
      token,
      data: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        account_status: user.account_status,
        station_id: user.station_id,
        station: user.station,
        last_login_at: currentTime,
      },
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to login",
      error: error.message,
    });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const authResult = authenticate(req);

    if (!authResult.success) {
      return sendJson(res, authResult.statusCode, {
        success: false,
        message: authResult.message,
      });
    }

    const user = await UserAccount.findByPk(authResult.user.user_id, {
      attributes: {
        exclude: ["password_hash"],
      },
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
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMyProfile,
};