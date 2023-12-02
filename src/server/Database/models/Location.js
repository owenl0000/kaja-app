const {Sequelize, DataTypes, Model} = require("sequelize");
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, "../../../../.env")}); //get the configs from the .env file
const sequelize = new Sequelize(`${process.env.DB_DIALECT}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER_HOST}:${process.env.DB_SERVER_PORT}/${process.env.DB_NAME}`);

class Location extends Model {};

Location.init({
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
    })
    const LOCATION = [
        {location: "New York City"}
    ];

(async () => {
    await sequelize.sync({force: true})
    await LOCATION.map((l) => {Location.create(l)})
})(); // IIFE, we want an Immediately Invoked Function Expression
//so that we immediately execute this action of creating the instance