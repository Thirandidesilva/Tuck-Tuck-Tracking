module.exports = (sequelize, DataTypes) => {
    const PoliceStation = sequelize.define('PoliceStation', {
        station_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        district_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        station_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        station_code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        address: {
            type: DataTypes.STRING
        },
        contact_number: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'police_stations',
        timestamps: false
    });

    PoliceStation.associate = (models) => {
        // Province District  relationship
        PoliceStation.belongsTo(models.District, {
            foreignKey: 'district_id',
            as: 'district'
        });

        //  One station has many users
        PoliceStation.hasMany(models.UserAccount, {
            foreignKey: 'station_id',
            as: 'users',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });
    };

    return PoliceStation;
};