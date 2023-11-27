const {Sequelize, DataTypes, Model} = require("sequelize");
require("dotenv").config({ path: `${process.cwd()}/.env`}); //get the configs from the .env file
const sequelize = new Sequelize(`${process.env.DB_DIALECT}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER_HOST}:${process.env.DB_SERVER_PORT}/${process.env.DB_NAME}`);

//we have to import the sequelize which will have a new instance used with the db...

class Business extends Model {};

Business.init({
        //attributes for the table
        business_id: {
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
            allowNull: false
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
        sequelize,
        freezeTableName: true // create the table with the same name as the model...
    })

const BUSINESS = [
    {business_id: "cF1k0Y1tgCf4AMEaNU3_yA", business_name:"Born & Raised NYC", business_url:"https://www.yelp.com/biz/born-and-raised-nyc-brooklyn?adjust_creative=o2R38fORawk4CuPMZJOCUg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=o2R38fORawk4CuPMZJOCUg", business_reviews: 7, business_rating:4.5, business_price:"$", business_address:["Brooklyn, NY 11221"]}
    //if the image or phonenum are empty string do not pass it into the param so that the db can use the default value...
    //so we essentially have to do a check if the String.length !== 0 then we pass it, otherwise we don't.
];

(async () => {
    await sequelize.sync({force: true});
    //fetch the data here
    await BUSINESS.map((b) => Business.create(b));
})();

    

    

