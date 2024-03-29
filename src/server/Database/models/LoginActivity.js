const { Sequelize, DataTypes, Model } = require("sequelize");
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, "../../../../.env")});
const sequelize = new Sequelize(`${process.env.DB_DIALECT}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER_HOST}:${process.env.DB_SERVER_PORT}/${process.env.DB_NAME}`);

class LoginActivity extends Model {};

LoginActivity.init({
  // Assuming you have a User model with an 'id' as primary key
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'Users', // This should be the table name, not the model name
        key: 'id',
    },
  },
  loginMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'LoginActivity',
  freezeTableName: true
});

module.exports = LoginActivity;
