require("dotenv").config({ path: '../../.env'}) //configure the api environment
const express = require("express");
const router = express.Router();
const db = require("../Database/newDBConnection");
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

/*
percent encoding

␣	!	"	#	$	%	&	'	(	)	*	+	,	/	:	;	=	?	@	[	]
%20	%21	%22	%23	%24	%25	%26	%27	%28	%29	%2A	%2B	%2C	%2F	%3A	%3B	%3D	%3F	%40	%5B	%5D

*/
router.get('/', (req, res) => {
    res.send(encodeURIComponent(Object.values(req.query)[0]))//this will get us the query parameters of the query
})


module.exports = router;
