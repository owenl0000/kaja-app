const express = require("express");
const router = express.Router();
const db = require("../Database/seed");

router.get('/', (req, res) => {//get data from PostgreSQL
    db.any(`SELECT * FROM \"Location\" `)//query database for all the data
        .then(body => res.send({cached_locations: body}))
        .catch(() => res.send(`<center><h1>There was an error loading the data</h1></center>`));
});

module.exports = router;
