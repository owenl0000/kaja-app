import React, { useState } from 'react';
import recommendations from '../api/recommendationData'; 
import TriangleToggle from '../utils/TriangleToggle';
import YelpStars from '@/utils/YelpStars';
import Image from 'next/image';
import 'font-awesome/css/font-awesome.min.css';

function Recommendations({ type, onAddPlace = () => {} }) {

  const [isOpen, setIsOpen] = useState({
      area: true,
      morning: true,
      breakfast: true,
      lunch: false,
      afternoon: false,
      night: false,
      dinner: false,
      hotels: false,
  });

  const getUpdatedSectionName = (sectionId) => {
    const mapping = {
      'area': 'Recommendations Around Your Area',
      'morning': 'Morning Recommendations',
      'breakfast': 'Best Places for Breakfast',
      'lunch': 'Top Spots for Lunch',
      'afternoon': 'Afternoon Delights',
      'night': 'Nightlife Recommendations',
      'dinner': 'Dinner Destinations',
      'hotels': 'Recommended Hotels',
      // ... add more mappings here
    };
    return mapping[sectionId] || sectionId; // Fallback to sectionId if not found in mapping
  };
    
  const [startIndex, setStartIndex] = useState({
    area: 0,
    morning: 0,
    breakfast: 0,
    lunch: 0,
    afternoon: 0,
    night: 0,
    dinner: 0,
    hotels: 0,
  });
  
  const toggleSection = (section) => {
    setIsOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const nextPage = (section) => {
    setStartIndex((prev) => ({ ...prev, [section]: prev[section] + 3 }));
  };

  const prevPage = (section) => {
    setStartIndex((prev) => ({ ...prev, [section]: Math.max(0, prev[section] - 3) }));
  };

  const isPrevDisabled = (section) => startIndex[section] === 0;
  const isNextDisabled = (section) => startIndex[section] >= recommendations[section].length - 3;

  const renderPlace = (place, index) => {
    // Abbreviate the review count
    const abbreviateNumber = (num) => {
      if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
      return num;
  };
    return (
      <div key={index} className="w-[250px] 2xl:w-[350px] 2xl:h-[350px] px-3 mb-4 mx-2 border rounded p-1 shadow-lg relative bg-white">
        <div className="relative h-48 2xl:h-[228px] bg-gray-200 mt-2">
          <div className="w-full h-full flex justify-center items-center">
            <img src={place.image}></img> 
          </div>
        </div>
        <div className="pt-2 px-2 pb-1">
          <div className="flex justify-between items-center mb-2">
            <h3>{place.name}</h3>
            <button 
                className="rounded-full w-6 h-6 flex items-center justify-center bg-transparent" 
                onClick={() => {console.log("Button clicked, place:", place); 
                onAddPlace(place); }}
            >
                <i className="fa fa-plus text-red-500"></i>
            </button>


          </div>
          <div className="flex flex-col xl:flex-row xl:items-center mt-1">
            <div className="stars flex-shrink-0">
              <YelpStars rating={place.stars} size="small" multiplier="3x"/>
            </div>
            <span className="mt-1 md:mt-0 xl:ml-2 text-gray-500">{abbreviateNumber(place.reviews)} reviews</span>
          </div>
        </div>
        <div className="xl:mb-0 ml-2 mb-0">
          {/* Yelp icon acting as a link */}
          <a href={place.yelpLink} target="_blank" rel="noopener noreferrer">
            <Image src="/images/yelp_logo.png" alt="Yelp" width={50} height={20} />
          </a>
        </div>
      </div>
    );
  };
    
  const section = type;
  const sectionData = recommendations[section];

  return (
    <div className="flex flex-col p-4 md:mx-20 md:w-6/7 mx-auto">
      <div className="border rounded p-6 md:w-[80%] lg:w-[90%] xl:w-[100%]">
        <div className="flex justify-between items-center ">
          <h2 className="text-2xl">{getUpdatedSectionName(section)}</h2>
          <button className="text-blue-500" onClick={() => toggleSection(section)}>{isOpen[section] ? 'Close' : 'Open'}</button>
        </div>
        {isOpen[section] && (
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
        )}
      </div>
    </div>
  );
}  

export default Recommendations;
