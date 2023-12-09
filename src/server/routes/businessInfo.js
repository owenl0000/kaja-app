require("dotenv").config({ path: '../../.env'}) //configure the api environment
const express = require("express");
const router = express.Router();
const pgp = require("pg-promise")();//needs to be like this as we are initializing without options
const {db} = require('../Database/seed')


router.get('/', (req, res) => {
    db.any(`SELECT * FROM \"Business\" WHERE location='${decodeURIComponent(Object.values(req.query)[0])}'`)
        .then(raw => res.send({business_data: raw}))
        .catch(err => console.error(err));
})

module.exports = router;