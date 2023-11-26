const express = require("express");
const router = express.Router();
const pgp = require("pg-promise")();//needs to be like this as we are initializing without options
require("dotenv").config({ path: `${process.cwd()}/.env`}); //get the configs from the .env file
const db = pgp(process.env.DB_CONNECT_STRING);//we need some sort of connection as the parameter 

router.get('/', (req, res) => {
    db.any("SELECT * FROM \"Business\" WHERE id=1")
        .then(raw => res.send({business_data: raw}))
        .catch(err => console.error(err));
})



module.exports = router;