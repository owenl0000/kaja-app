const {Sequelize, DataTypes, Model} = require("sequelize");
require("dotenv").config({ path: `${process.cwd()}/.env`}); //get the configs from the .env file
const sequelize = new Sequelize(`${process.env.DB_DIALECT}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER_HOST}:${process.env.DB_SERVER_PORT}/${process.env.DB_NAME}`);

class Location extends Model {};

module.exports = Location.init({
        //attributes for the table
        location: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, 
    {
        //model options
        sequelize,
        freezeTableName: true
    }
);