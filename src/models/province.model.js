module.exports = (sequelize, DataTypes) => {
    const Province = sequelize.define('Province', {
        province_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        province_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        province_code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        tableName: 'provinces',
        timestamps: false
    });

    Province.associate = (models) => {
        Province.hasMany(models.District, {
            foreignKey: 'province_id',
            as: 'districts'
        });
    };

    return Province;
};