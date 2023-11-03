
const express = require("express");
const router = express.Router();
const db = require("../newDBConnection");
const api = require('api')('@yelp-developers/v1.0#9nl412lo4fa3f9');
const apiKey = "Bearer";
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
            return(api.v3_business_search(query)
                        .then(({data}) => {
                            let beg = 0;
                            let end = 10; //first ten items
                            while(end <= data.length){
                                if( end  == data.length){
                                    db.none("INSERT into yelp(key, data) VALUES($<key>, $<data>)", {//write to the yelp DB
                                        key: nextKey,
                                        data: data.slice(beg, end)
                                    }).catch(err => console.error(err))
                                    break;
                                }
                                db.none("INSERT into yelp(key, data) VALUES($<key>, $<data>)", {//write to the yelp DB
                                    key: nextKey,
                                    data: data.slice(beg, end)
                                })
                                .then(() =>{
                                    nextKey++;
                                    beg = end;
                                    end += 10;
                                })
                                .catch(err => console.error(err))
                            }
                        })
                        .then(status => {res.send(`<h1><center>The status is ${status}</h1></center>`)})
                        .catch(err => console.error(err)))})
        .catch(err => console.error(err));
})

module.exports = router;
