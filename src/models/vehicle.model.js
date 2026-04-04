module.exports = (sequelize, DataTypes) => {
    const Vehicle = sequelize.define("Vehicle", {
        vehicle_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        registration_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        vehicle_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING
        },
        year_of_manufacture: {
            type: DataTypes.INTEGER
        },
        chassis_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        engine_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM("ACTIVE", "INACTIVE", "UNDER_MAINTENANCE"),
            allowNull: false,
            defaultValue: "ACTIVE"
        }
    }, {
        tableName: "vehicles",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    });

    Vehicle.associate = (models) => {
        Vehicle.hasMany(models.VehicleAssignment, {
            foreignKey: "vehicle_id",
            as: "assignments"
        });
    };

    return Vehicle;
};