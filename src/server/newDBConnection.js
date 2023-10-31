const http = require("http");
const { Sedgwick_Ave } = require("next/font/google");
const pgp = require("pg-promise")();//needs to be like this as we are initializing without options
const connectionString = 'postgres://brandonvasquez:0000@localhost:5432/test';
const api = require('api')('@yelp-developers/v1.0#9nl412lo4fa3f9')
const db = pgp(connectionString);//we need some sort of connection as the parameter 

const apikey = "";

//the powerrrrrr
const query = {
    location: 'New%20York%20City',
    term: 'food', 
    sort_by: 'distance', 
    limit: '10',
}

/*
space = %20
ampersand = 

*/
api.auth(apiKey); //authenticate with Bearer apikey

db.any("SELECT * FROM yelp WHERE key=1")//check if key 1 is populated 
    .then(found => {
        if(found.length != 0){
            console.log("cached values at key 0 ready to access");
            return found
        }
        return(api.v3_business_search(query)
                //{data} is to destructure the response object since the property is literally called data
                .then(({data}) => {
                    return ( // populate the db with key and data containing the res body only
                            db.none("INSERT into yelp(key, data) VALUES($<key>, $<data>)", {//write to the yelp DB
                                key: 1,
                                data: data
                            })
                        );
                })
                .catch(err => console.error(err)))})
    .catch(err => console.error(err));
