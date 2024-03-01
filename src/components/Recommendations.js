const path = require('path');
require("dotenv").config({ path: path.join(__dirname, "../../.env")}); //get the configs from the .env file
import React, { useState, useEffect } from 'react';
import TriangleToggle from '../utils/TriangleToggle';
import YelpStars from '@/utils/YelpStars';
import Image from 'next/image';
import 'font-awesome/css/font-awesome.min.css';
import { useRouter } from 'next/router';
import { encode } from 'punycode';
//const fetchUrl = `http://${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/info` //url used for fetching
//we are using this for rendering

function Recommendations({  onAddPlace = () => {} , sortOrder, priceFilter}) {
  console.log(priceFilter);
  const router = useRouter();
  const { location, activity } = router.query; //if empty or undefined set it to some place or required search 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [addedIconIndex, setAddedIconIndex] = useState(null);
  const [data, setData] = useState({ area0: [], area1: [], area2: [], area3: [] });
  const priceOrder = { 5: 5, 4: 4, 3: 3, 2: 2, 1: 1, '': 0 };
  const [isLoading, setIsLoading] = useState(true);

  const sortAndDistributeData = (originalData, order, priceFilter) => {
    // Flatten the data from all areas into a single array
    const allData = Object.values(originalData).flat();
  
    // Sort the flattened data if necessary
    switch (order) {
      case 'ascending':
        allData.sort((a, b) => a.reviews - b.reviews);
        break;
      case 'descending':
        allData.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'ratingAscending':
        allData.sort((a, b) => a.stars - b.stars);
        break;
      case 'ratingDescending':
        allData.sort((a, b) => b.stars - a.stars);
        break;
      default:
        // No sorting
        break;
    }

    if (priceFilter) {
      const pricePriority = {
        '$$$$$': [5, 4, 3, 2, 1, 0],
        '$$$$': [4, 3, 2, 1, 5, 0],
        '$$$': [3, 2, 1, 5, 4, 0],
        '$$': [2, 1, 5, 4, 3, 0],
        '$': [1, 2, 3, 4, 5, 0],
        '': []
      };

      allData.sort((a, b) => {
        let priceA = a.price ? priceOrder[a.price.length] : priceOrder[''];
        let priceB = b.price ? priceOrder[b.price.length] : priceOrder[''];
  
        return pricePriority[priceFilter].indexOf(priceA) - pricePriority[priceFilter].indexOf(priceB);
      });
    }
  
    // Distribute sorted data back into the four areas
    const distributedData = { area0: [], area1: [], area2: [], area3: [] };
    allData.forEach((item, index) => {
      const sectionIndex = Math.floor(index / 3) % 4; // Determines the area (0, 1, 2, 3)
      const pageIndex = Math.floor(index / 12); // Determines the page within the area
      const sectionKey = `area${sectionIndex}`;
      if (pageIndex < 4) { // Ensures only the first four pages of each area are filled
        distributedData[sectionKey].push(item);
      }
    });
  
    return distributedData;
  };

  const isContentUnavailable = () => {
    // Check if loading is still ongoing or if there is no data after loading is done
    return !isLoading && Object.values(data).every(section => section.length === 0);
  };
  
  useEffect(() => {
    console.log("Loading State: ", isLoading); // Add this line to debug
    // ... rest of the useEffect code ...
  }, [isLoading]);
  
  useEffect(() => {
    // Sort and distribute data when sortOrder changes
    if (data.area0.length > 0 || data.area1.length > 0 || data.area2.length > 0 || data.area3.length > 0) {
      const sortedAndDistributedData = sortAndDistributeData(data, sortOrder, priceFilter);
      setData(sortedAndDistributedData);

      // Update local storage with sorted data
      const queryKey = `${location}_${activity || 'all'}`;
      const updatedStoredData = { ...localStorage.getItem('yelpRecommendations') ? JSON.parse(localStorage.getItem('yelpRecommendations')) : {}, [queryKey]: sortedAndDistributedData };
      localStorage.setItem('yelpRecommendations', JSON.stringify(updatedStoredData));
    }
  }, [sortOrder, priceFilter]);

  useEffect(() => {
    if (location) {
      setIsLoading(true);
      // Construct a unique identifier for the current query
      const queryKey = `${location}_${activity || 'all'}`;
      const storedData = localStorage.getItem('yelpRecommendations');
      let storedDataParsed = storedData ? JSON.parse(storedData) : {};

      // Fetch new data if the current query is different from the cached one
      if (!storedDataParsed[queryKey]) {
        fetch(`${process.env.NEXT_PUBLIC_SERVER_DEV || process.env.NEXT_PUBLIC_SERVER_PROD}/populate?location=${encodeURIComponent(location.toLowerCase())}&activity=${encodeURIComponent(activity.toLowerCase())}`)
          .then(() => fetch(`${process.env.NEXT_PUBLIC_SERVER_DEV || process.env.NEXT_PUBLIC_SERVER_PROD}/info?location=${encodeURIComponent(location.toLowerCase())}${`&activity=${encodeURIComponent(activity.toLowerCase())}`}`))
          .then(out => out.json())
          .then(body => body.business_data)
          .then((body) => {
            const fetchedData = body;
            setData(fetchedData);
            let newRecommendations = { area0: [], area1: [], area2: [], area3: [] };
            let dataIndex = 0;
            for (let block in newRecommendations) {
              for (let i = 0; i < 12 && dataIndex < fetchedData.length; i++, dataIndex++) {
                const dataItem = fetchedData[dataIndex];
                newRecommendations[block].push({
                  id: dataItem.business_id,
                  name: dataItem.business_name,
                  address: dataItem.business_address,
                  contact: dataItem.business_phone,
                  image: dataItem.business_image,
                  stars: dataItem.business_rating,
                  reviews: dataItem.business_reviews,
                  coordinates: dataItem.coordinate,
                  price: dataItem.business_price,
                  yelpLink: encodeURI(dataItem.business_url) // encode so that the user can see it
                });
              }
            }
  
            // Update state with fetched data
            setData(newRecommendations);
            // Clear previous data and update local storage with new data
            storedDataParsed = {}; // Clear previous data
            storedDataParsed[queryKey] = newRecommendations;
            
            localStorage.setItem('yelpRecommendations', JSON.stringify(storedDataParsed));           
            
          })
          .catch(err => console.error(err))    
          .finally(() => setIsLoading(false));
      } else {
        console.log('Using cached data');
        setIsLoading(false);
        setData(storedDataParsed[queryKey]);
      }
    }
  }, [location, activity]);




  useEffect(() => {
    if (addedIconIndex !== null) {
      const timer = setTimeout(() => setAddedIconIndex(null), 3000); // Reset after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [addedIconIndex]);

  const handleAddPlace = (place) => {
    onAddPlace(place);
    setToastMessage(`${place.name} has been added.`);
    setShowToast(true);
    setAddedIconIndex(place.id);
    setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
  };

  const renderLoading = () => (
    <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
    </div>
  );

  const shouldDisplaySection = (sectionData) => {
    return sectionData.length >= 1;
  };

  const [startIndex, setStartIndex] = useState({
    area0: 0,
    area1: 0,
    area2: 0,
    area3: 0,
  });

  useEffect(() => {
    setStartIndex({ area0: 0, area1: 0, area2: 0, area3: 0 });
  }, [location, activity]);

  const nextPage = (section) => {
    setStartIndex((prev) => ({ ...prev, [section]: prev[section] + 3 }));
  };

  const prevPage = (section) => {
    setStartIndex((prev) => ({ ...prev, [section]: Math.max(0, prev[section] - 3) }));
  };

  const isPrevDisabled = (section) => startIndex[section] === 0;

  const isNextDisabled = (section) => startIndex[section] >= data[section].length - 3;

  const renderPlace = (place) => {
    // Abbreviate the review count
    const abbreviateNumber = (num) => {
      if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
      return num;
    };
    return (
        <div key={place.id} className={`w-[250px] 2xl:w-[300px] 2xl:h-auto px-3 mb-4 mx-2 border rounded-lg p-1 shadow-lg relative bg-white overflow-hidden`}>
          <div className="relative h-48 2xl:h-[228px]  mt-4 mb-1 mx-3">
            <div className="w-full h-full flex justify-center items-center rounded-lg">
              <img src={place.image} className='h-full w-full object-cover rounded-lg' alt={place.name}></img>
            </div>
          </div>
          <div className="pt-2 px-2 pb-1">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm md:text-base font-semibold truncate" style={{maxWidth: '80%'}}>{place.name}</h3>
              <button
                  className="rounded-full w-6 h-6 flex items-center justify-center bg-transparent"
                  onClick={() => {console.log("Button clicked, place:", place);
                    handleAddPlace(place); }}
              >
                <i className={`fa ${addedIconIndex === place.id ? 'fa-check text-green-500' : 'fa-plus text-red-500'}`}></i>
              </button>
            </div>
            <div className="flex flex-col xl:flex-row xl:items-center mt-1">
              <div className="stars flex-shrink-0">
                <YelpStars rating={place.stars} size="small" multiplier="3x"/>
              </div>
              <span className="mt-1 md:mt-0 xl:ml-2 text-gray-500 truncate" style={{maxWidth: '80%'}}>{abbreviateNumber(place.reviews)} reviews</span>
            </div>
          </div>
          <div className="ml-2 mb-4 flex justify-between">
            <div className={`p-1 bg-gray-200 rounded text-xs ${place.price ? '' : 'italic'}`}>{place.price || "Price Unavailable"}</div>
            <a href={place.yelpLink} target="_blank" rel="noopener noreferrer">
              <Image src="/images/yelp_logo.png" alt="Yelp" width={50} height={20} />
            </a>
          </div>
        </div>
    );
  };

  let messageDisplayed = false;

  return (
    <div className="flex flex-col p-4">
    {showToast && <div className="toast">{toastMessage}</div>}

    {isLoading ? (
      renderLoading()
    ) : isContentUnavailable() ? (
        <div className="text-center my-10">
          <p className="text-lg text-gray-600">No results found. Try being more specific in your search.</p>
        </div>
      ) : (
        Object.keys(data).map((section) => {
          const sectionData = data[section];
          if (!shouldDisplaySection(sectionData)) {
            if (!messageDisplayed) {
              messageDisplayed = true; // Ensure message is only displayed once
              return (
                <div key={section} className="text-center my-10">
                  <p className="text-lg text-gray-600">Try being more specific in your search for more options.</p>
                </div>
              );
            } else {
              return null; // Don't display message for subsequent sections
            }
          }
          return (
            <div key={section} className="border rounded p-6 md:w-[80%] lg:w-[90%] xl:w-[100%] mb-5 small:mx-auto">
              <div className="flex flex-col items-center mt-4">
                <div className="flex items-center justify-center w-full">
                  <div onClick={() => !isPrevDisabled(section) && prevPage(section)} className={`h-8 ${isPrevDisabled(section) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <TriangleToggle isOpen={false} />
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-center">
                    {sectionData.slice(startIndex[section], startIndex[section] + 3).map((place, placeIndex) => (
                      renderPlace(place, placeIndex)
                    ))}
                  </div>
                  <div onClick={() => !isNextDisabled(section) && nextPage(section)} className={`h-8 ${isNextDisabled(section) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <TriangleToggle isOpen={true} />
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Recommendations;