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
    open_now: 'true',
    limit: '50', // 50 is the max
    radius: '5000'
}



const BUSINESS = Array.from({length: 50}, () => (
    {
        business_id: "LOADING...", 
        location: "LOADING...",
        business_name:"LOADING...", 
        business_image:"LOADING...",
        business_url:"LOADING...",
        business_reviews: 0, 
        business_rating: 0.0, 
        business_price: "LOADING...", 
        business_address: ["LOADING..."],
        business_phone: "LOADING..."
    }
))

const TERM = [{
    location: "LOADING...", 
    term: "LOADING..."
}];

//SELECT * FROM \"Term\" WHERE  location = 'categoryA' AND term = 'typeA'

//we will make the TYPE table into a TERM Table which will hold the location and 



/*
percent encoding

␣	!	"	#	$	%	&	'	(	)	*	+	,	/	:	;	=	?	@	[	]
%20	%21	%22	%23	%24	%25	%26	%27	%28	%29	%2A	%2B	%2C	%2F	%3A	%3B	%3D	%3F	%40	%5B	%5D

*/

router.get('/', (req, res) => {
    if(encodeURIComponent(Object.values(req.query)[0]) === "undefined"){ query.location = 'New%20York%20City'; }
    else{query.location = encodeURIComponent(Object.values(req.query)[0])}

    TERM.location = decodeURIComponent(query.location);
    TERM.term = decodeURIComponent(query.term);
    
    //now before querying to the api we want to check if the DB already contains this location.

    //the check will query 

    db.any(`SELECT EXISTS (SELECT 1 FROM \"Term\" WHERE location='Africa' AND term='${TERM.term}')`)
        .then(raw => {
            if(raw[0].exists){
                res.send(`<h1>FOUND SOMETHING</h1>`)
            }
            else{
                res.send(`<h1>FOUND NOTHING</h1>`)
            }
        })
        .catch(err => console.error(err));


    //res.send(query)//this will get us the query parameters of the query
})


// api.v3_business_search(query)
//                         .then(({data}) => data.businesses)
//                         .then(processed => {
//                             for(i = 0; i < BUSINESS.length; i++){
//                                 BUSINESS[i].business_id = processed[i].id;
//                                 BUSINESS[i].location = decodeURIComponent(query.location);
//                                 if(processed[i].image_url.length){BUSINESS[i].business_image = processed[i].image_url}
//                                 BUSINESS[i].business_name = processed[i].name;
//                                 BUSINESS[i].business_url = processed[i].url;
//                                 BUSINESS[i].business_reviews = processed[i].review_count;
//                                 BUSINESS[i].business_rating = processed[i].rating;
//                                 BUSINESS[i].business_price = processed[i].price; //price can be null
//                                 BUSINESS[i].business_address = processed[i].location.display_address;
//                                 if(processed[i].display_phone.length){BUSINESS[i].business_phone = processed[i].display_phone}
//                                 BUSINESS[i].business_phone = processed[i].display_phone
//                             }
//                         })
//                         .then(() => {
//                             (async () => {
//                                 try{
//                                     await TERM.map((t) => {Term.create(t)});
//                                     await Business.bulkCreate(BUSINESS);
//                                 }catch(err){
//                                     console.error(err)
//                                 }
//                             })();
//                         })
//                         .catch(err => console.error(err));




module.exports = router;
