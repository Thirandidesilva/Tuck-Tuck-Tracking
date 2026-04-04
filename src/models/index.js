const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Province = require("./province.model")(sequelize, DataTypes);
db.District = require("./district.model")(sequelize, DataTypes);
db.PoliceStation = require("./policeStation.model")(sequelize, DataTypes);
db.UserAccount = require("./userAccount.model")(sequelize, DataTypes);
db.Driver = require("./driver.model")(sequelize, DataTypes);
db.Vehicle = require("./vehicle.model")(sequelize, DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;