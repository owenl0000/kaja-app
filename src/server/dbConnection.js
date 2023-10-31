//get our packages
const yelp = require("yelp-fusion");
const http = require("http");
const pgp = require("pg-promise")();//needs to be like this as we are initializing without options
const connectionString = 'postgres://brandonvasquez:0000@localhost:5432/test';
//You are connected to database "test" as user "brandonvasquez" via socket in "/tmp" at port "5432".
//we got the above info using \conninfo
//typical style of connectionString is postgres://username:password@host:port/database?ssl=false&application_name=name&fallback_application_name=name&client_encoding=encoding
const db = pgp(connectionString);//we need some sort of connection as the parameter 

const apiKey = "xeieSk97CiewFoEHF2ibqs-AopR4lQGJYTtMxF9eaWrUqOOmOaNk6PLycTOewHxvzSTq69thVngMvHslAyIx4IXOQ0l0vOBvDNppDFonvq_MSrN9Qjlogj33URE4ZXYx";
//yelp api fusion key
const client = yelp.client(apiKey);
//setting up yelp api client

//this way we only have to change the location we want by only changing the location here!!!!

let query = {
    term: "Amy Thai Bistro",
    location: "brooklyn, ny"
}; 
//client.search(query).then(res => res.body).catch(err => console.log(err));

//the below will populate index 0 if the DB is initialized empty.
db.any("SELECT * FROM yelp WHERE key=0")//check if key 0 is populated which should always hold default data!
    .then(found => {
        if(found.length != 0){//if the database is empty pull from the API, key 0 should always be populated
            console.log("cached values at key 0 ready to access");
            return found
        }
        return(client.search(query) // query the api for info 
                    .then((res) =>{
                        return ( // populate the db with key and data containing the res body only
                            db.none("INSERT into yelp(key, data) VALUES($<key>, $<data>)", {//write to the yelp DB
                                key: 0,
                                data: res.body
                            })
                        );
                    })
                    .catch(err => console.error(err)));
    })
    .catch(err => console.error(err));


module.exports = db;





//=======================================NOT USING HERE===============================================
/*


app.get('/images', (req, res) => {//get data from PostgreSQL
    db.any(`SELECT * FROM yelp`)//query database for all the data
        .then(data => JSON.parse(data[0].data))//has a key prop called key we preprocess to durn the data prop which holds the data into an obj
        .then(preprocess => preprocess.businesses)
        .then(process => process.map(place => place["image_url"]))
        .then(out => out.map(image => `<center><img src=${image}></center>`))
        .then(send => res.send(send[Math.floor(Math.random() * send.length)]))
        .catch(() => res.send(`<center><h1>There was an error loading the data</h1></center>`));
    //we have to pre-process the data
});


/*
app.get() get data

app.post() add data

app.put() edit data 

app.delete() delete data

*/