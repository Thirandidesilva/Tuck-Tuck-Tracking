module.exports = (sequelize, DataTypes) => {
  const UserAccount = sequelize.define(
    "UserAccount",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      station_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "police_stations",
          key: "station_id",
        },
      },
      full_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Full name is required",
          },
          len: {
            args: [2, 150],
            msg: "Full name must be between 2 and 150 characters",
          },
        },
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: {
          name: "unique_user_email",
          msg: "Email already exists",
        },
        validate: {
          notEmpty: {
            msg: "Email is required",
          },
          isEmail: {
            msg: "Please provide a valid email address",
          },
        },
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(
          "HQ_ADMIN",
          "PROVINCIAL_OFFICER",
          "STATION_OFFICER",
          "SYSTEM_ADMIN"
        ),
        allowNull: false,
        validate: {
          isIn: {
            args: [[
              "HQ_ADMIN",
              "PROVINCIAL_OFFICER",
              "STATION_OFFICER",
              "SYSTEM_ADMIN",
            ]],
            msg: "Invalid role value",
          },
        },
      },
      account_status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },
      last_login_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "user_accounts",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  UserAccount.associate = (models) => {
    UserAccount.belongsTo(models.PoliceStation, {
      foreignKey: "station_id",
      as: "station",
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  };

  return UserAccount;
};