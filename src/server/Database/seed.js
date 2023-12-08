const http = require("http");
const pgp = require("pg-promise")();//needs to be like this as we are initializing without options
const connectionString = `${process.env.DB_DIALECT}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER_HOST}:${process.env.DB_SERVER_PORT}/${process.env.DB_NAME}`;
const api = require('api')('@yelp-developers/v1.0#9nl412lo4fa3f9');
const db = pgp(connectionString); //we need some sort of connection as the parameter 

//import the models
const Business = require("./models/Business"); 
const Term = require('./models/Term');
const models = {business: Business, term: Term}

const apiKey = `Bearer ${process.env.YELP_API_KEY}`;//setting the API key
api.auth(apiKey); //authenticate with Bearer apikey

const query = {
    location: 'New%20York%20City',
    term: 'food%2C%20entertainment%2C%20hangout%2C%20tourist%2C%20hotspots', 
    sort_by: 'distance', 
    //open_now: 'true',
    limit: '50', // 50 is the max
    //radius: '5000'
};



//here we want to recieve the imports of the models so that we can sync and seed them.
const BUSINESS = Array.from({length: 50}, () => (
    {
        business_id: "LOADING...",  
        location: "LOADING...",
        business_name:"LOADING...",
        business_url:"LOADING...",
        business_reviews: 0, 
        business_rating: 0.0, 
        business_price: "LOADING...", 
        business_address: ["LOADING..."],
    }
))

const TERM = [{
    location: decodeURIComponent(query.location), 
    term: decodeURIComponent(query.term)
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
                                    await TERM.map((t) => {Term.create(t)});
                                    await Business.bulkCreate(BUSINESS);
                                }catch(err){
                                    console.error(err)
                                }
                            })();
                        })
                        .catch(err => console.error(err));


module.exports = {db, models}; //export db so that it can be used in other endpoints

