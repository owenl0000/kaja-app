require("dotenv").config({ path: '../../.env'}) //configure the api environment
const express = require("express");
const router = express.Router();
const pgp = require("pg-promise")();//needs to be like this as we are initializing without options
const {db} = require('../Database/seed')


router.get('/', (req, res) => {
    const query = {
        location: decodeURIComponent(Object.values(req.query)[0]) || "New York City",
        term: decodeURIComponent(Object.values(req.query)[1]) || "food, entertainment, hangout, tourist, hotspots"
    }

    db.any(`SELECT * FROM \"Business\" WHERE location='${query.location}' AND term='${query.term}'`)
        .then(raw => res.send({business_data: raw}))
        .catch(err => console.error(err));
})

module.exports = router;