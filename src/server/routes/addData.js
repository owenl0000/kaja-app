require("dotenv").config({ path: '../../.env'}) //configure the api environment
const express = require("express");
const router = express.Router();
//const db = require("../Database/newDBConnection");
const api = require('api')('@yelp-developers/v1.0#9nl412lo4fa3f9');
const apiKey = `Bearer ${process.env.YELP_API_KEY}`;
api.auth(apiKey); 
const {db, models} = require("../Database/seed");

//adding to the database

const query = {
    location: '',
    term: 'food%2C%20entertainment%2C%20hangout%2C%20tourist%2C%20hotspots', 
    sort_by: 'distance', 
    limit: '50', // 50 is the max
    radius: '5000'
}



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
    location: "LOADING...", 
    term: "LOADING..."
}];

router.get('/', (req, res) => {
    // if(encodeURIComponent(Object.values(req.query)[0]) === "undefined"){ query.location = 'New%20York%20City'; }
    // else{query.location = encodeURIComponent(Object.values(req.query)[0])}

    const query = {
        location: req.query === "undefined" ? 'New%20York%20City' : Object.values(req.query)[0],
        term: 'food%2C%20entertainment%2C%20hangout%2C%20tourist%2C%20hotspots', 
        sort_by: 'distance', 
        limit: '50', // 50 is the max
        radius: '5000'
    }

    TERM.location = decodeURIComponent(query.location);
    TERM.term = decodeURIComponent(query.term);

    db.any(`SELECT EXISTS (SELECT 1 FROM \"Term\" WHERE location='${TERM.location}' AND term='${TERM.term}')`)
        .then(raw => raw[0].exists ? true : false)
        .then(found => {
            console.log(found)
            if(found){return "FOUND"}
            return api.v3_business_search(query)
                .then(({data}) => data.businesses)
                .then(data => {
                    for(i = 0; i < BUSINESS.length; i++){
                        if(data[i] !== undefined){
                            BUSINESS[i].business_id = data[i].id;
                            BUSINESS[i].location = decodeURIComponent(query.location);
                            if(data[i].image_url.length){BUSINESS[i].business_image = data[i].image_url}
                            BUSINESS[i].business_name = data[i].name;
                            BUSINESS[i].business_url = data[i].url;
                            BUSINESS[i].business_reviews = data[i].review_count;
                            BUSINESS[i].business_rating = data[i].rating;
                            BUSINESS[i].business_price = data[i].price; //price can be null
                            BUSINESS[i].business_address = data[i].location.display_address;
                            if(data[i].display_phone.length){BUSINESS[i].business_phone = data[i].display_phone}
                            BUSINESS[i].business_phone = data[i].display_phone
                        }
                        else{
                            BUSINESS.splice(i)
                            break;
                        }
                    }
                })
                .then(() => {
                    (async () => {
                        try{
                            await TERM.map((t) => {models.term.create(t)});
                            await models.business.bulkCreate(BUSINESS);
                        }catch(err){
                            console.error(err)
                        }
                    })();
                })
                .catch(err => console.error(err));
        })
        .then(out => res.send(BUSINESS))
        .catch(err => console.error(err));
    
})







module.exports = router;
