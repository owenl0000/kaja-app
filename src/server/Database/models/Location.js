const {Sequelize, DataTypes, Model} = require("sequelize");
require("dotenv").config({ path: `${process.cwd()}/.env`}); //get the configs from the .env file
const sequelize = new Sequelize(process.env.DB_CONNECT_STRING);

class Location extends Model {};


//In this model we actually won't care about sending it to the front end of the 

Location.init({
        //attributes for the table
        location_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        //model options
        sequelize,
        freezeTableName: true
    })
    Location.associate = (models) => {
        models.Location.belongsTo(models.Business);
        //this will add a business_id column to Type
    }
    const LOCATION = [
        {location_id:"0", location: "New York City"}
    ];

    (async () => {
        await sequelize.sync({force: true})
        await LOCATION.map((l) => {Location.create(l)})
    })(); // IIFE, we want an Immediately Invoked Function Expression
//so that we immediately execute this action of creating the instance