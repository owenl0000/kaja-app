const path = require('path');
require("dotenv").config({ path: path.join(__dirname, "../../../../.env")}); //configure the api environment
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.SERVER_PORT || "3060";//set the port


//to get the yelp api key: process.env.YELP_API_KEY
//to get the server port: process.env.SERVER_PORT

//routes


const populateRoute = require("./routes/addData");
const sampleRoute = require("./routes/rawData");
const businessInfo = require("./routes/businessInfo");


app.use(cors()); // allow for comms between front and back

app.use(cookieParser()); //body parser I think have to look more into this....
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('landing');//render some pug page
});

app.use('/sample', sampleRoute);
app.use('/populate', populateRoute);
app.use('/info', businessInfo);

app.listen(port, () => {
    console.log(`The server is live at: http://127.0.0.1:${port}/`);
})