require("dotenv").config({ path: '../../.env'}) //configure the api environment
const express = require("express");
const router = express.Router();
const {db} = require('../Database/seed')


router.get('/', (req, res) => {
    const query = {
        location: decodeURIComponent(Object.values(req.query)[0]) || "new york city",
        term: decodeURIComponent(Object.values(req.query)[1]) || "food, entertainment, hangout, tourist, hotspots"
    }

    db.any(`SELECT * FROM \"Business\" WHERE location='${query.location}' AND term='${query.term}'`)
        .then(raw => res.send({business_data: raw}))
        .catch(err => console.error(err));
})

module.exports = router;