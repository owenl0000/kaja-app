
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

//connection to backend

var recommendations = {
  area: [],
  morning: [],
  afternoon: [],
  night: [],
};
//work on making it such that at each category we can map to it something.


//had to fix this so that we could still use the same concept but it has to be reworked

//use useeffect to handle api request here

//const n = 12; //how much boxes to create within the sections
fetch("http://127.0.0.1:3000/sample")
      .then(response => response.json())
      .then(fetchedData => {
        for (let block in recommendations){
          recommendations[block] = new Array(12).fill(({
            name: fetchedData.name,
            image: fetchedData.image_url,
            stars: fetchedData.rating,
            reviews: fetchedData.review_count,
            yelpLink: fetchedData.url
          }))
        }
        return recommendations
      })
      .catch(err => console.error(err))

export default recommendations;


