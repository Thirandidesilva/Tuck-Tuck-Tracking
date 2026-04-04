module.exports = (sequelize, DataTypes) => {
    const VehicleAssignment = sequelize.define("VehicleAssignment", {
        assignment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        driver_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        vehicle_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        device_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        assigned_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        unassigned_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM("ACTIVE", "COMPLETED", "CANCELLED"),
            allowNull: false,
            defaultValue: "ACTIVE"
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: "vehicle_assignments",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    });

    VehicleAssignment.associate = (models) => {
        VehicleAssignment.belongsTo(models.Driver, {
            foreignKey: "driver_id",
            as: "driver"
        });

        VehicleAssignment.belongsTo(models.Vehicle, {
            foreignKey: "vehicle_id",
            as: "vehicle"
        });

        VehicleAssignment.belongsTo(models.TrackingDevice, {
            foreignKey: "device_id",
            as: "device"
        });

        VehicleAssignment.hasMany(models.LocationPing, {
            foreignKey: "assignment_id",
            as: "location_pings"
        });
    };

    return VehicleAssignment;
};