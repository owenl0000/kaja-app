const http = require("http");
const pgp = require("pg-promise")();//needs to be like this as we are initializing without options
const connectionString = 'postgres://brandonvasquez:0000@localhost:5432/test';
const api = require('api')('@yelp-developers/v1.0#9nl412lo4fa3f9');
const db = pgp(connectionString);//we need some sort of connection as the parameter 
const apiKey = "Bearer 00odUuU7TchRRbXqu2voHysTJlRDc6xwaI1jdJrO_cuFnBsuwETlNyYuMRgj6oqYLMq2qoW6NwJB6cig00y3K7Hw_K1Q4Aw8bCnPQKGby0--PkgjPWT5sV9bp2tEZXYx";


const query = {
    location: 'New%20York%20City',
    term: 'food', 
    sort_by: 'distance', 
    limit: '50', // 50 is the max
}

api.auth(apiKey); //authenticate with Bearer apikey


//we can get the length of the database so we know the key we are at by doing a SELECT * FROM yelp query and geeting the .length of it
//then setting the key prop of our RDBMS we can simply do key: dbContent.length + 1 - 1
//we are 0-indexed in the db so the key 0 means 1 item is in the db
// key 1 means there are possibly 2 items in the db...


//checking is key 0 is populated which is the cache 
db.any("SELECT * FROM yelp WHERE key=1")//check if key 1 is populated 
    .then(found => {
        if(found.length != 0){
            console.log("cached values at key 0 ready to access");
            return found
        }
        return(api.v3_business_search(query)//query api
                .then(({data}) => {//{data} is to destructure the response object since the property is literally called data
                    //split query items by 10
                    return ( // populate the db with key and data containing the res body only
                            db.none("INSERT into yelp(key, data) VALUES($<key>, $<data>)", {//write to the yelp DB
                                key: found.length,
                                data: data.businesses
                            }) // do exception/error handling!!!!!!!
                        );
                })
                .catch(err => console.error(err)))})
    .catch(err => console.error(err));



/*

In the postgreSQL db the data should look like this

[
    {
        key: someKey (int)
        data: someData (array of obj)
    }
]

*/




module.exports = db; //export db so that it can be used in other endpoints

