const express = require("express");
const router = express.Router();
const {db} = require('../Database/seed')

router.get('/', (req, res) => {//get data from PostgreSQL
    db.any(`SELECT * FROM \"Term\"`)//query database for all the data
        .then(body => res.send({cached_location_data: body}))
        .catch(() => res.send(`<center><h1>There was an error loading the data</h1></center>`));
});

module.exports = router;
