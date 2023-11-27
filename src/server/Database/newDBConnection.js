const http = require("http");
const pgp = require("pg-promise")();//needs to be like this as we are initializing without options
const connectionString = `${process.env.DB_DIALECT}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER_HOST}:${process.env.DB_SERVER_PORT}/${process.env.DB_NAME}`;
const api = require('api')('@yelp-developers/v1.0#9nl412lo4fa3f9');
const db = pgp(connectionString);//we need some sort of connection as the parameter 
const Business = require("../app") // I want to fix these so that the seeding actually happens here and what not.


const apiKey = `Bearer ${process.env.YELP_API_KEY}`;//setting the API key

const query = {
    location: 'New%20York%20City',
    term: 'food, entertainment', 
    sort_by: 'distance', 
    limit: '50', // 50 is the max
}

api.auth(apiKey); //authenticate with Bearer apikey


//here we want to recieve the imports of the models so that we can sync and seed them.


//what we also want to do here is essentially get the data or we can do that fetch somewhere else but it could also work here
const BUSINESS = [{
        location_id:"0",
        business_id: "", 
        business_name:"", 
        business_url:"",
        business_reviews: 0, 
        business_rating: 0.0, 
        business_price: "", 
        business_address: ""
}];

const LOCATION = [{
    location_id:"0", 
    location: "New York City"
}];

const TYPE = [{
    business_id: "", 
    type: []
}]


api.v3_business_search(query)
                        .then(({data}) => {
                          //first we want to get the important data from this
                          //iterate over it and store into an   
                        })
                        .catch(err => console.error(err))




module.exports = db; //export db so that it can be used in other endpoints

