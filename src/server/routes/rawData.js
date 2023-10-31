const express = require("express");
const router = express.Router();
const db = require("../dbConnection");

router.get('/', (req, res) => {//get data from PostgreSQL
    db.any(`SELECT * FROM yelp`)//query database for all the data
        .then(response => JSON.parse(response[1].data))
        .then(body => res.send(body))
        .catch(() => res.send(`<center><h1>There was an error loading the data</h1></center>`));
    //we have to pre-process the data
});

module.exports = router