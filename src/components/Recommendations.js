const path = require('path');
require("dotenv").config({ path: path.join(__dirname, "../../.env")}); //get the configs from the .env file
import React, { useState, useEffect } from 'react';
import TriangleToggle from '../utils/TriangleToggle';
import YelpStars from '@/utils/YelpStars';
import Image from 'next/image';
import 'font-awesome/css/font-awesome.min.css';
import { useRouter } from 'next/router';
//const fetchUrl = `http://${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/info` //url used for fetching
//we are using this for rendering

function Recommendations({  onAddPlace = () => {} }) {
  const router = useRouter();
  const { location, activity } = router.query; //if empty or undefined set it to some place or required search 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [addedIconIndex, setAddedIconIndex] = useState(null);
  const [data, setData] = useState({ // gets the api data
    area: [],
    morning: [],
    afternoon: [],
    night: [],
  });

  console.log("Query Params ", {location, activity});
  useEffect(() => {
    if (location) {
      // Construct a unique identifier for the current query
      const queryKey = `${location}_${activity || 'all'}`;
      const storedData = localStorage.getItem('yelpRecommendations');
      let storedDataParsed = storedData ? JSON.parse(storedData) : {};

      // Fetch new data if the current query is different from the cached one
      if (!storedDataParsed[queryKey]) {
        console.log('Fetching new data');
        fetch(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/populate?location=${encodeURIComponent(location)}&activity=${encodeURIComponent(activity)}`)
            .then(() => fetch(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/info?location=${encodeURIComponent(location)}${`&activity=${encodeURIComponent(activity)}`}`))
            .then(out => out.json())
            .then(body => body.business_data)
            .then((body) => {
              const fetchedData = body;
              let newRecommendations = { area: [], morning: [], afternoon: [], night: [] };
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
                    yelpLink: dataItem.business_url
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
      } else {
        console.log('Using cached data');
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



  const [startIndex, setStartIndex] = useState({
    area: 0,
    morning: 0,
    afternoon: 0,
    night: 0,
  });

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
        <div key={place.id} className={`w-[250px] 2xl:w-[350px] 2xl:h-auto px-3 mb-4 mx-2 border rounded-lg p-1 shadow-lg relative bg-white overflow-hidden`}>
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
          <div className="ml-2 mb-4">
            <a href={place.yelpLink} target="_blank" rel="noopener noreferrer">
              <Image src="/images/yelp_logo.png" alt="Yelp" width={50} height={20} />
            </a>
          </div>
        </div>
    );
  };


  return (
      <div className="flex flex-col p-4">
        {showToast && <div className="toast">{toastMessage}</div>}
        {Object.keys(data).map((section) => {
          const sectionData = data[section];
          return (
              <div key={section} className="border rounded p-6 md:w-[80%] lg:w-[90%] xl:w-[100%] mb-5">
                <div className="flex justify-between items-center ">
                </div>
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
        })}
      </div>
  );
}

export default Recommendations;