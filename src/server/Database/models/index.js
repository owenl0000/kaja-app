//this will be to formulate the connections etc...
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
require("dotenv").config({ path: `${process.cwd()}/.env`});
const db = {};
console.log(db, config);
const sequelize = new Sequelize(process.env.DB_CONNECT_STRING);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
