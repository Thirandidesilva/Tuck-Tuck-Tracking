module.exports = (sequelize, DataTypes) => {
    const Driver = sequelize.define("Driver", {
        driver_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nic: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        license_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM("ACTIVE", "INACTIVE", "SUSPENDED"),
            allowNull: false,
            defaultValue: "ACTIVE"
        }
    }, {
        tableName: "drivers",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    });

    Driver.associate = (models) => {
        Driver.hasMany(models.VehicleAssignment, {
            foreignKey: "driver_id",
            as: "assignments"
        });
    };

    return Driver;
};