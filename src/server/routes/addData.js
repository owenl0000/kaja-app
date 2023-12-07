require("dotenv").config({ path: '../../.env'}) //configure the api environment
const express = require("express");
const router = express.Router();
//const db = require("../Database/newDBConnection");
const api = require('api')('@yelp-developers/v1.0#9nl412lo4fa3f9');
const apiKey = `Bearer ${process.env.YELP_API_KEY}`;
const {db, models} = require("../Database/newDBConnection");

//adding to the database

const query = {
    location: '',
    term: 'food%2C%20entertainment', 
    sort_by: 'distance', 
    limit: '50', // 50 is the max
}


//want to try to add enough data to like one single entry/datapoint

api.auth(apiKey); 
//we need to make this a list of 50 objects.....



const BUSINESS = Array.from({length: 50}, () => (
    {
        business_id: "garbageId", 
        business_name:"THIS IS A PLACE", 
        business_image:"",
        business_url:"",
        business_reviews: 0, 
        business_rating: 0.0, 
        business_price: "", 
        business_address: ["something", "something"],
        business_phone: ""
    }
))

const LOCATION = [{
    location: decodeURIComponent(query.location)
}];

const TYPE = [{
    business_id: "TESTING ADDING MORE", 
    type: decodeURIComponent(query.term).split(" ")  
}];


/*
percent encoding

␣	!	"	#	$	%	&	'	(	)	*	+	,	/	:	;	=	?	@	[	]
%20	%21	%22	%23	%24	%25	%26	%27	%28	%29	%2A	%2B	%2C	%2F	%3A	%3B	%3D	%3F	%40	%5B	%5D

*/

// const users = [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}];
// before(()=>models.sequelize.sync({force: true}));
// before(()=> models.User.bulkCreate(users));





router.get('/', (req, res) => {
    if(encodeURIComponent(Object.values(req.query)[0]) === "undefined"){ query.location = 'New%20York%20City'; }
    else{query.location = encodeURIComponent(Object.values(req.query)[0])}





    (async () => {
        try{
            await TYPE.map((t) => {models.type.create(t)}) 
            await LOCATION.map((l) => {models.location.create(l)}) 
            await models.business.bulkCreate(BUSINESS);
        }catch(err){
            console.error(err)
        }
    })();
    res.send(query)//this will get us the query parameters of the query
})


module.exports = router;
