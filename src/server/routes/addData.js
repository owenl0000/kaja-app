require("dotenv").config({ path: '../../.env'}) //configure the api environment
const express = require("express");
const router = express.Router();
const api = require('api')('@yelp-developers/v1.0#9nl412lo4fa3f9');
const apiKey = `Bearer ${process.env.YELP_API_KEY}`;
api.auth(apiKey); 
const {db, models} = require("../Database/seed");



router.get('/', (req, res) => {
    
    const query = {
        location: Object.values(req.query)[0] === '' ? 'new%20york%20city' : encodeURIComponent(Object.values(req.query)[0]),
        term: Object.values(req.query)[1] === '' ? 'food%2C%20entertainment%2C%20hangout%2C%20tourist' : encodeURIComponent(Object.values(req.query)[1]), 
        sort_by: 'distance', 
        limit: '50', // 50 is the max
        radius: '10000'
    }

    const TERM = {
        location: decodeURIComponent(query.location), 
        term: decodeURIComponent(query.term)
    };

    const BUSINESS = Array.from({length: 50}, () => (
        {
            business_id: "LOADING...",  
            location: decodeURIComponent(query.location),
            term: decodeURIComponent(query.term),
            business_name:"LOADING...",
            business_url:"LOADING...",
            business_reviews: 0, 
            business_rating: 0.0, 
            business_price: "LOADING...", 
            business_address: ["LOADING..."],
        }
    ))

    db.any(`SELECT EXISTS (SELECT 1 FROM \"Term\" WHERE location='${decodeURIComponent(query.location)}' AND term='${decodeURIComponent(query.term)}')`)
        .then(found => {
            if(found[0].exists){return "FOUND"}
            return api.v3_business_search(query)
                .then(({data}) => data.businesses)
                .then(data => {
                    for(i = 0; i < data.length; i++){
                        BUSINESS[i].business_id = data[i].id;
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
                    BUSINESS.splice(data.length);//remove any unused portion of the array
                })
                .then(() => models.term.create(TERM))
                .then(() => models.term.findOne({where : {location: TERM.location, term: TERM.term}}))
                .then((TermId) => BUSINESS.forEach(loc => loc.TermId = TermId.dataValues.id)) // set the id for each business)
                .then(() => models.business.bulkCreate(BUSINESS))
                .catch(err => console.error(err));
        })
        .then(() => res.send({business_data: BUSINESS}))
        .catch(() => res.send('<center><h1>There was an error adding data</h1></center>'));
        
})



module.exports = router;
