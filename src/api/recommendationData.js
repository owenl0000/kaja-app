
/*

fetchedData.id will be what is used for avoiding key errors so it will be the unique key you can use for the place
fetchedData.price is self explanatory
fetchedData.rating is rating
fetchedData.image_url get the url attribute

id: fetchedData.id, // Unique ID
              name: fetchedData.name,
              image: fetchedData.image_url,
              stars: fetchedData.rating,
              reviews: fetchedData.review_count,
              yelpLink: fetchedData.url,

*/

import React, { useState, useEffect } from 'react';
export default function apiData() {
    const [data, setData] = useState({
        area: [],
        morning: [],
        afternoon: [],
        night: [],
    });

    useEffect(() => {
        fetch("http://127.0.0.1:3060/sample")
            .then(response => response.json())
            .then(body => body.businesses)
            .then(fetchedData => {
                let newRecommendations = { area: [], morning: [], afternoon: [], night: [] };
                for (let block in newRecommendations) {
                    for (let i = 0; i < 12; i++) {
                        const load = fetchedData[Math.floor(Math.random() * fetchedData.length)];
                        newRecommendations[block].push({
                            id: load.id,
                            name: load.name,
                            address: "testing",
                            contact: "testing",
                            description: "some description",
                            image: load.image_url,
                            stars: load.rating,
                            reviews: load.review_count,
                            yelpLink: load.url
                        });
                    }
                }
                setData(newRecommendations);
            })
            .catch(err => console.error(err));
        console.log(data)
    }, []);
}   



