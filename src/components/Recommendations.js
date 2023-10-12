import React, { useState } from 'react';
import recommendations from '../api/recommendationData'; 
import TriangleToggle from '../utils/TriangleToggle';
import YelpStars from '@/utils/YelpStars';
import Image from 'next/image';

function Recommendations({ type }) {
    const [isOpen, setIsOpen] = useState({
        area: true,
        morning: true,
        breakfast: true,
        // ... other categories
      });
    
      const [startIndex, setStartIndex] = useState({
        area: 0,
        morning: 0,
        breakfast: 0,
        // ... other categories
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

      const renderPlace = (place) => (
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 2xl:w-1/4 border rounded p-1 shadow-lg relative mx-3 mb-4">
          <div className="relative h-48 bg-gray-200">
            <div className="w-full h-full flex justify-center items-center">
              <span>Image</span>
            </div>
          </div>
          <div className="p-2">
            <div className="flex justify-between items-center mb-2">
              <h3>{place.name}</h3>
              <button className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">+</button>
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center mt-1">
                <div className="stars flex-shrink-0">
                  <YelpStars rating={place.stars} size="small" multiplier="3x"/>
                </div>
                <span className="ml-2 text-gray-500">{place.reviews} reviews</span>
              </div>
              <div className="mt-2">
                {/* Yelp icon acting as a link */}
                <a href={place.yelpLink} target="_blank" rel="noopener noreferrer">
                  <Image src="/images/yelp_logo.png" alt="Yelp" width={50} height={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      );
      
      
      
  return (
    <div className="flex flex-col w-full p-5 mx-auto">
      {Object.keys(recommendations).map((section) => (
        <div key={section} className="mb-8 border rounded p-6"> 
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection(section)}>
            <h2 className="text-2xl">{section}</h2>
            <button className="text-blue-500">{isOpen[section] ? 'Close' : 'Open'}</button>
          </div>
          {isOpen[section] && (
            <div className="flex flex-wrap justify-center items-center mt-4">
              <div onClick={() => !isPrevDisabled(section) && prevPage(section)} className={`h-8 ${isPrevDisabled(section) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <TriangleToggle isOpen={false} />
              </div>
              {recommendations[section].slice(startIndex[section], startIndex[section] + 3).map(renderPlace)}
              <div onClick={() => !isNextDisabled(section) && nextPage(section)} className={`h-8 ${isNextDisabled(section) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <TriangleToggle isOpen={true} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}  

export default Recommendations;
