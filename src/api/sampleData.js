const generatePlaces = (name, count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `${name.replace(/\s+/g, '_').toLowerCase()}_${i + 1}`, // Unique ID
      name: `${name} ${i + 1}`,
      address: '123 Main St, City, State',
      contact: '123-456-7890',
      description: 'This is a sample description',
      image: 'https://via.placeholder.com/150',
      stars: 4.5,
      reviews: 2000,
      yelpLink: `https://yelp.com/${name.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
    }));
  };

const sampleData = {
  area: generatePlaces('Area', 12),
  morning: generatePlaces('Morning Place', 12),
  afternoon: generatePlaces('Afternoon Place', 12),
  night: generatePlaces('Nightlife Spot', 12),
};

export default sampleData;

// I need this to test out the activity between planner and recommendations