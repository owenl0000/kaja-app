const {Sequelize, DataTypes, Model} = require("sequelize");
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, "../../../../.env")}); //get the configs from the .env file
const sequelize = new Sequelize(`${process.env.DB_DIALECT}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER_HOST}:${process.env.DB_SERVER_PORT}/${process.env.DB_NAME}`);

//we have to import the sequelize which will have a new instance used with the db...

class Business extends Model {};

module.exports = Business.init({
        //attributes for the table
        business_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        location:{
            type: DataTypes.STRING,
            allowNull: false
        },
        term:{
            type: DataTypes.STRING,
            allowNull: false
        },
        business_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        business_image: {
            type: DataTypes.STRING,
            defaultValue: `kaja-logo-black.png` // have to fix this not working
        },
        business_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        business_reviews: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        business_rating: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        business_price: {
            type: DataTypes.STRING,
        },
        business_address: {
            type: DataTypes.ARRAY(DataTypes.STRING), // an array of strings....
        },
        business_phone: {
            type: DataTypes.STRING,
            defaultValue: "No Phone Number"
        }
    }, 
    {
        //model options
        sequelize, //we need to move this out so that a sequelize db connection isn't hanging here and all are just made in
        freezeTableName: true // create the table with the same name as the model...
    }
);




    

    

