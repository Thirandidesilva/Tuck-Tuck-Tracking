module.exports = (sequelize, DataTypes) => {
    const LocationPing = sequelize.define("LocationPing", {
        ping_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        assignment_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: false
        },
        longitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: false
        },
        speed: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        heading: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        recorded_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: "location_pings",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    });

    LocationPing.associate = (models) => {
        LocationPing.belongsTo(models.VehicleAssignment, {
            foreignKey: "assignment_id",
            as: "assignment"
        });
    };

    return LocationPing;
};