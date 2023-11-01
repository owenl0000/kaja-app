// components/PlanCreator.js
import React, { useState, useEffect } from 'react';
import TimePicker from './TimePicker';
import Image from 'next/image';
import sampleData from '@/api/sampleData';
import 'font-awesome/css/font-awesome.min.css';



const PlanCreator = ({ addedPlaces = [], selectedDate }) => {
    console.log("Received addedPlaces in PlanCreator:", addedPlaces);

    const [localAddedPlaces, setLocalAddedPlaces] = useState(addedPlaces);

    useEffect(() => {
      const savedPlaces = localStorage.getItem('addedPlaces');
      if (savedPlaces) {
        setLocalAddedPlaces(JSON.parse(savedPlaces));
      } else {
        // If there's nothing in localStorage, use sampleData
        setLocalAddedPlaces(sampleData.area); // or any other part of sampleData
      }
    }, []);

    const [places, setPlaces] = useState([
      {
        id: 1,
        name: 'Sample Place',
        address: '123 Main St, City, State', 
        contact: '123-456-7890', 
        description: 'This is a sample description',
        image: 'https://via.placeholder.com/100',
        yelpLink: 'https://www.yelp.com/',
      },
    ]);

    const removePlace = (indexToRemove) => {
      const updatedPlaces = localAddedPlaces.filter((_, index) => index !== indexToRemove);
      setLocalAddedPlaces(updatedPlaces);
      localStorage.setItem('addedPlaces', JSON.stringify(updatedPlaces));
    };
  
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [placeToRemove, setPlaceToRemove] = useState(null);
    const [userNotes, setUserNotes] = useState({});
    const [timeFrame, setTimeFrame] = useState({});
    const [budget, setBudget] = useState({});

    const handleBudgetChange = (id, amount) => {
        setBudget({ ...budget, [id]: amount });
    };

    const handleNoteChange = (id, note) => {
        setUserNotes({ ...userNotes, [id]: note });
    };

    const handleTimeFrameChange = (id, frame) => {
        setTimeFrame({ ...timeFrame, [id]: frame });
    };

    const totalPlaceholders = 5 - places.length;

  return (
    <div className="flex flex-col items-start bg-gray-100">
      {/* Large Box */}
      <div className="flex flex-col w-3/4 bg-white rounded-lg shadow-lg mt-10 ml-10 p-4">
        {/* Render addedPlaces here */}
        {localAddedPlaces.map((place, index) => (
          <div key={index} className="flex items-start mb-6 bg-gray-200 p-4 rounded-lg">
            {/* Image */}
            <img src={place.image} alt={place.name} className="w-48 h-48 rounded flex-shrink-0" />
            {/* Details */}

            
            <div className="ml-6 flex flex-row w-full h-full">
              <div className="flex flex-col">
                <div className="text-lg font-semibold min-w-[100px]">{place.name}</div>
                <div className="text-sm min-w-[200px]">{place.address || 'N/A'}</div> {/* Added min-width */}
                <div className="text-sm min-w-[200px]">{place.contact || 'N/A'}</div> {/* Added min-width */}
                <div className="text-sm min-w-[200px]">Description: {place.description || 'N/A'}</div> {/* Added min-width */}
                <a href={place.yelpLink} target="_blank" rel="noopener noreferrer" className='my-1'>
                    <Image src="/images/yelp_logo.png" alt="Yelp" width={40} height={10}/>
                </a>
              </div>
              {/* Time Frame, Notes, and Budget */}
              <div className="ml-6 flex flex-col w-full h-full ">
                <div className="flex flex-row align-items-center relative"> {/* Added align-items-center */}
                <TimePicker onChange={(timeFrame) => handleTimeFrameChange(place.id, timeFrame)} />
                <input
                    type="text"
                    placeholder="Enter Budget"
                    value={budget[place.id] || ''}
                    onChange={(e) => handleBudgetChange(place.id, e.target.value)}
                    className=" p-1 border rounded ml-2 w-1/3 budget-input" 
                />
                {/* Remove Icon */}
                <button 
                  className="absolute top-0 right-0" 
                  onClick={() => { setShowConfirmModal(true); setPlaceToRemove(index); }}
                >
                    <i className="fa fa-trash fa-lg text-red-500"></i>
                </button>
                </div>
                <textarea
                    placeholder="Enter Notes"
                    value={userNotes[place.id] || ''}
                    onChange={(e) => handleNoteChange(place.id, e.target.value)}
                    className="notes-input mt-2 p-1 border rounded w-full h-full resize-none" // Updated class name
                />
                </div>
            </div>
          </div>
        ))}
        {/* Confirmation Modal */}
        {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg">
            <p>Are you sure you want to remove this place?</p>
            <div className="flex justify-end mt-2">
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => { removePlace(placeToRemove); setShowConfirmModal(false); }}
              >
                Yes
              </button>
              <button 
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => setShowConfirmModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
        {/* Placeholder boxes */}
        {[...Array(totalPlaceholders)].map((_, index) => (
          <div key={index} className="flex items-start mb-6 bg-gray-200 p-4 rounded-lg">
            {/* Placeholder Image */}
            <div className="w-48 h-32 bg-gray-300 rounded"></div>
            {/* Placeholder Details */}
            <div className="ml-6">
              <div className="bg-gray-300 w-32 h-6 mb-2 rounded"></div>
              <div className="bg-gray-300 w-48 h-4 mb-2 rounded"></div>
              <div className="bg-gray-300 w-36 h-4 mb-2 rounded"></div>
              <div className="bg-gray-300 w-24 h-4 mb-2 rounded"></div>
              <div className="bg-gray-300 w-24 h-4 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanCreator;
