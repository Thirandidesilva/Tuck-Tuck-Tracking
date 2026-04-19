module.exports = (sequelize, DataTypes) => {
    const TrackingDevice = sequelize.define("TrackingDevice", {
        device_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        device_serial_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        sim_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        manufacturer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false
        },
        installation_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM("ACTIVE", "INACTIVE", "FAULTY", "MAINTENANCE"),
            allowNull: false,
            defaultValue: "ACTIVE"
        }
    }, {
        tableName: "tracking_devices",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    });

    TrackingDevice.associate = (models) => {
        TrackingDevice.hasMany(models.VehicleAssignment, {
            foreignKey: "device_id",
            as: "assignments"
        });
    };

    return TrackingDevice;
};