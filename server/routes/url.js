const express = require("express");
const router = express.Router();
const db = require("../dbConnection");

router.get('/', (req, res) => {//get data from PostgreSQL
    db.any(`SELECT * FROM yelp`)//query database for all the data
        .then(data => JSON.parse(data[0].data))//has a key prop called key we preprocess to durn the data prop which holds the data into an obj
        .then(preprocess => preprocess.businesses)
        .then(process => process.map(place => place.url))
        .then(out => out.map(url => `<center><h1><a href=${url} target=_blank>link</a></h1></center>`))
        .then(send => res.send(send[Math.floor(Math.random() * send.length)]))
        .catch(() => res.send(`<center><h1>There was an error loading the data</h1></center>`));
    //we have to pre-process the data
});

module.exports = router