const generatePlaces = (name, count) => {
    return Array.from({ length: count }, (_, i) => ({
      name: `${name} ${i + 1}`,
      image: `/images/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      stars: 4.5,
      reviews: 2000,
      yelpLink: `https://yelp.com/${name.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
    }));
  };
  
  const recommendations = {
    area: generatePlaces('Area', 12),
    morning: generatePlaces('Morning Place', 12),
    breakfast: generatePlaces('Breakfast Spot', 12),
    lunch: generatePlaces('Lunch Spot', 12),
    afternoon: generatePlaces('Afternoon Place', 12),
    night: generatePlaces('Nightlife Spot', 12),
    dinner: generatePlaces('Dinner Place', 12),
    hotels: generatePlaces('Hotel', 12),
  };
  
  
  export default recommendations;
  