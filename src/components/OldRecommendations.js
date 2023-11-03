import React, { useState } from 'react';
import TriangleToggle from '../utils/TriangleToggle';
import YelpStars from '@/utils/YelpStars';
import Image from 'next/image';
import 'font-awesome/css/font-awesome.min.css';
import sampleData from '@/api/recommendationData';

function OldRecommendations({ onAddPlace = () => {} }) {
  const [startIndex, setStartIndex] = useState({
    area: 0,
    morning: 0,
    afternoon: 0,
    night: 0,
  });

  const getUpdatedSectionName = (sectionId) => {
    const mapping = {
      'area': 'Recommendations Around Your Area',
      'morning': 'Morning Recommendations',
      'afternoon': 'Afternoon Delights',
      'night': 'Nightlife Recommendations',
      // ... add more mappings here
    };
    return mapping[sectionId] || sectionId; // Fallback to sectionId if not found in mapping
  };

  const nextPage = (section) => {
    setStartIndex((prev) => ({ ...prev, [section]: prev[section] + 3 }));
  };

  const prevPage = (section) => {
    setStartIndex((prev) => ({ ...prev, [section]: Math.max(0, prev[section] - 3) }));
  };

  const isPrevDisabled = (section) => startIndex[section] === 0;
  const isNextDisabled = (section) => startIndex[section] >= sampleData[section].length - 3;

  const renderPlace = (place) => {
    const abbreviateNumber = (num) => {
      return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString();
    };
    
    return (
      <div key={place.id} className="w-[250px] 2xl:w-[350px] 2xl:h-[350px] px-3 mb-4 mx-2 border rounded p-1 shadow-lg relative bg-white">
        <div className="relative h-48 2xl:h-[228px] bg-gray-200 mt-2">
          <div className="w-full h-full flex justify-center items-center">
            <img src={place.image} style={{height: "195px", width: "225px"}}></img> 
          </div>
        </div>
        <div className="pt-2 px-2 pb-1">
          <div className="flex justify-between items-center mb-2">
            <h3>{place.name}</h3>
            <button 
                className="rounded-full w-6 h-6 flex items-center justify-center bg-transparent" 
                onClick={() => onAddPlace(place)}
            >
                <i className="fa fa-plus text-red-500"></i>
            </button>
          </div>
          <div className="flex flex-col xl:flex-row xl:items-center mt-1">
            <YelpStars rating={place.stars} size="small" multiplier="3x" />
            <span className="mt-1 md:mt-0 xl:ml-2 text-gray-500">
              {abbreviateNumber(place.reviews)} reviews
            </span>
          </div>
        </div>
        <div className="xl:mb-0 ml-2 mb-0">
          <a href={place.yelpLink} target="_blank" rel="noopener noreferrer">
            <Image src="/images/yelp_logo.png" alt="Yelp" width={50} height={20} />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col p-4 md:mx-20 md:w-6/7 mx-auto">
      {Object.keys(sampleData).map((section) => {
        const sectionData = sampleData[section];
        return (
          <div key={section} className="border rounded p-6 md:w-[80%] lg:w-[90%] xl:w-[100%] mb-5">
            <div className="flex justify-between items-center ">
              <h2 className="text-2xl">{getUpdatedSectionName(section)}</h2>
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

export default OldRecommendations;
