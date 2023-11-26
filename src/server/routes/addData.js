require("dotenv").config({ path: '../../.env'}) //configure the api environment
const express = require("express");
const router = express.Router();
const db = require("../newDBConnection");
const api = require('api')('@yelp-developers/v1.0#9nl412lo4fa3f9');
const apiKey = `Bearer ${process.env.YELP_API_KEY}`;
//adding to the database

const query = {
    location: 'New%20York%20City',
    term: 'food', 
    sort_by: 'distance', 
    limit: '50', // 50 is the max
}


//want to try to add enough data to like one single entry/datapoint

api.auth(apiKey); 


router.get('/', (req, res) => {
    db.any("SELECT * FROM yelp")
        .then(dbContent => {
            //1 get the length so that we can decide the next key
            let nextKey = dbContent.length; // since it is zero indexed the length will return the value that the next key could be

            //now we query api and get our 50

            //to handle checks of the DB we need to include a queriedLocations row in the DB.
            //we will do that next week as it will mostly be me working on data modeling as well
            return(api.v3_business_search(query)
                        .then(({data}) => {
                            db.none("INSERT into yelp(key, data) VALUES($<key>, $<data>)", {//write to the yelp DB
                                key: nextKey,
                                data: data.slice(beg, end)
                            }).catch(err => console.error(err))
                        })
                        .then(status => {res.send(`<h1><center>The status is ${status}</h1></center>`)})
                        .catch(err => console.error(err)))})
        .catch(err => console.error(err));
})

module.exports = router;
