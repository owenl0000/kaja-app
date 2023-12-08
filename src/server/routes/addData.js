require("dotenv").config({ path: '../../.env'}) //configure the api environment
const { query } = require("express");
const express = require("express");
const router = express.Router();
//const db = require("../Database/newDBConnection");
const api = require('api')('@yelp-developers/v1.0#9nl412lo4fa3f9');
const apiKey = `Bearer ${process.env.YELP_API_KEY}`;
api.auth(apiKey); 
const {db, models} = require("../Database/seed");

const TERM = {
    location: "LOADING...", 
    term: "LOADING..."
};



router.get('/', (req, res) => {
    const BUSINESS = Array.from({length: 50}, () => (//nest within so that we can update it
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

    const query = {
        location: Object.values(req.query)[0] === undefined ? 'New%20York%20City' : encodeURIComponent(Object.values(req.query)[0]),
        term: Object.values(req.query)[1] === undefined ? 'food%2C%20entertainment%2C%20hangout%2C%20tourist%2C%20hotspots' : encodeURIComponent(Object.values(req.query)[1]), 
        sort_by: 'distance', 
        limit: '50', // 50 is the max
        radius: '5000'
    }

    TERM.location = decodeURIComponent(query.location);
    TERM.term = decodeURIComponent(query.term);

    db.any(`SELECT EXISTS (SELECT 1 FROM \"Term\" WHERE location='${decodeURIComponent(query.location)}' AND term='${decodeURIComponent(query.term)}')`)
        .then(raw => raw[0].exists ?  true :  false)
        .then(found => {
            console.log(query)
            if(found){return "FOUND"}
            return api.v3_business_search(query)
                .then(({data}) => data.businesses)
                .then(data => {
                    for(i = 0; i < data.length; i++){
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
                    BUSINESS.splice(data.length);//remove any unused portion of the array
                })
                .then(() => {
                    (async () => {
                        try{
                            await models.term.create(TERM);
                            const TermId = await Term.findOne({where : {location: TERM.location, term: TERM.term}});// get the id to relate it to it's business
                            BUSINESS.forEach(loc => loc.TermId = TermId.dataValues.id) // set the id for each business
                            await models.business.bulkCreate(BUSINESS);
                        }catch(err){
                            console.error(err)
                        }
                    })();
                })
                .catch(err => console.error(err));
        })
        .then(() => res.send(BUSINESS))
        .catch(err => console.error(err));
    
})







module.exports = router;
