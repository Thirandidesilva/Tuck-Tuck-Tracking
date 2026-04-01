module.exports = (sequelize, DataTypes) => {
    const District = sequelize.define('District', {
        district_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        province_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        district_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        district_code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        tableName: 'districts',
        timestamps: false
    });

    District.associate = (models) => {
        District.belongsTo(models.Province, {
            foreignKey: 'province_id',
            as: 'province'
        });

        District.hasMany(models.PoliceStation, {
            foreignKey: 'district_id',
            as: 'policeStations'
        });
    };

    return District;
};