
//const db = require("./models/index");
//const {Business, Location, Type} = db;
const Business = require("./models/Business") // I want to fix these so that the seeding actually happens here and what not.
const Location = require("./models/Location")
const Type = require("./models/Type")

const BUSINESS = [
    {business_id: "cF1k0Y1tgCf4AMEaNU3_yA", business_name:"Born & Raised NYC", business_image:"https://s3-media1.fl.yelpcdn.com/bphoto/2r0HvrRvDfSUqr5wPuepKg/o.jpg", business_url:"https://www.yelp.com/biz/born-and-raised-nyc-brooklyn?adjust_creative=o2R38fORawk4CuPMZJOCUg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=o2R38fORawk4CuPMZJOCUg", business_reviews: 7, business_rating:4.5, business_price:"$", business_address:["Brooklyn, NY 11221"], business_phone: ""}
];

//location is what the user queried
const LOCATION = [
    {location_id:"0", location: "New York City"}
];

const TYPE = [
    {business_id: "cF1k0Y1tgCf4AMEaNU3_yA", type: ["foodtrucks", "latin"]}
];

(async () => {
    await BUSINESS.map((b) => Business.create(b));
    await LOCATION.map((l) => Location.create(l));
    await TYPE.map((t) => Type.create(t));
})();