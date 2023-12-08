const http = require("http");
const pgp = require("pg-promise")();//needs to be like this as we are initializing without options
const connectionString = `${process.env.DB_DIALECT}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER_HOST}:${process.env.DB_SERVER_PORT}/${process.env.DB_NAME}`;
const api = require('api')('@yelp-developers/v1.0#9nl412lo4fa3f9');
const db = pgp(connectionString); //we need some sort of connection as the parameter 


const Sequelize = require('sequelize');
//const sequelize = new Sequelize(connectionString); //we probably don't need this here

//import the models
const Business = require("./models/Business"); 
const Type = require('./models/Type');

const models = {business: Business, type: Type}
const apiKey = `Bearer ${process.env.YELP_API_KEY}`;//setting the API key


const query = {
    location: 'New%20York%20City',
    term: 'food%2C%20entertainment%2C%20hangout%2C%20fun', 
    sort_by: 'distance', 
    limit: '50' // 50 is the max
};

api.auth(apiKey); //authenticate with Bearer apikey

//here we want to recieve the imports of the models so that we can sync and seed them.
const BUSINESS = Array.from({length: 50}, () => (
    {
        business_id: "",  
        location: "",
        business_name:"",
        business_url:"",
        business_reviews: 0, 
        business_rating: 0.0, 
        business_price: "", 
        business_address: [""],
    }
))

const TYPE = [{
    business_id: decodeURIComponent(query.term), 
    type: query.term.split("%2C%20") //will hold the 
}];


//check if phone and image are null....
api.v3_business_search(query)
                        .then(({data}) => data.businesses)
                        .then(processed => {
                            for(i = 0; i < BUSINESS.length; i++){
                                BUSINESS[i].business_id = processed[i].id;
                                BUSINESS[i].location = decodeURIComponent(query.location);
                                if(processed[i].image_url.length){BUSINESS[i].business_image = processed[i].image_url}
                                BUSINESS[i].business_name = processed[i].name;
                                BUSINESS[i].business_url = processed[i].url;
                                BUSINESS[i].business_reviews = processed[i].review_count;
                                BUSINESS[i].business_rating = processed[i].rating;
                                BUSINESS[i].business_price = processed[i].price; //price can be null
                                BUSINESS[i].business_address = processed[i].location.display_address;
                                if(processed[i].display_phone.length){BUSINESS[i].business_phone = processed[i].display_phone}
                                BUSINESS[i].business_phone = processed[i].display_phone
                            }
                        })
                        .then(() => {
                            (async () => {
                                Type.hasMany(Business, {foreignKey: 'location_id'});//one to many relation with business and location
                                Business.belongsTo(Type);  
                                for(let model in models){
                                    try{
                                        await models[model].sequelize.sync({force: true}) //we don't really want to do this destructive behavior
                                    }
                                    catch(err){
                                        console.error(err);
                                    }
                                }
                                //we have to make the relations here 
                                try{
                                    await TYPE.map((t) => {Type.create(t)});
                                    await Business.bulkCreate(BUSINESS);
                                }catch(err){
                                    console.error(err)
                                }
                            })();
                        })
                        .catch(err => console.error(err));


module.exports = {db, models}; //export db so that it can be used in other endpoints

