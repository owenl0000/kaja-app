const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || "3060";//set the port
const path = require("path");

//routes
/*const nameRoute = require("./routes/name");
const imageRoute = require("./routes/images");*/
const populateRoute = require("./routes/addData");
const sampleRoute = require("./routes/rawData");

//

  

//https://www.freecodecamp.org/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together-c5798926047c/
//source used for most of this

app.use(cors()); // allow for comms between front and back

//we will connect the react side and express server side through fetch.
//
app.use(cookieParser()); //body parser I think have to look more into this....
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('landing');//render some pug page
});
  
/*app.use('/names', nameRoute);
app.use('/images', imageRoute);
app.use('/urls', urlRoute);
*/  
app.use('/sample', sampleRoute);
app.use('/populate', populateRoute);

app.listen(port, () => {
    console.log(`The server is live at: http://127.0.0.1:${port}/`);
})