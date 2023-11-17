// components/PlanCreator.js
import React, { useState, useEffect } from 'react';
import TimePicker from './TimePicker';
import Image from 'next/image';
import 'font-awesome/css/font-awesome.min.css';
import PlaceCard from './PlaceCard';

function PlanCreator({ selectedDate }) {
  const [placesForSelectedDate, setPlacesForSelectedDate] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [indexToRemove, setIndexToRemove] = useState(null);
  const [userNotes, setUserNotes] = useState({});
  const [timeFrame, setTimeFrame] = useState({});
  const [budget, setBudget] = useState({});
  console.log(selectedDate)

  const removePlace = () => {
    const updatedPlaces = placesForSelectedDate.filter((_, idx) => idx !== indexToRemove);
    const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
    allPlacesByDate[selectedDate] = updatedPlaces;
    localStorage.setItem('addedPlacesByDate', JSON.stringify(allPlacesByDate));

    setPlacesForSelectedDate(updatedPlaces);
    setShowConfirmModal(false);
    setIndexToRemove(null);
  };

  useEffect(() => {
    console.log("Working");
    // Fetch the places for the selected date from localStorage
    const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
    const places = allPlacesByDate[selectedDate] || [];
    setPlacesForSelectedDate(places);
  }, [selectedDate]);


  const handleBudgetChange = (id, amount) => {
    setBudget({ ...budget, [id]: amount });
  };

  const handleNoteChange = (id, note) => {
    setUserNotes({ ...userNotes, [id]: note });
  };

  const handleTimeFrameChange = (id, frame) => {
    setTimeFrame({ ...timeFrame, [id]: frame });
  };

  const onRemoveButtonClick = (index) => {
    setIndexToRemove(index);
    setShowConfirmModal(true);
  };
  console.log('Plans for selected date:', placesForSelectedDate, 'Type:', Array.isArray(placesForSelectedDate));
  const totalPlaceholders = placesForSelectedDate.length < 5 ? 5 - placesForSelectedDate.length : 0;

  return (
    <div className="flex flex-col items-start bg-gray-100">
      <div className="flex flex-col w-3/4 bg-white rounded-lg shadow-lg mt-10 ml-10 p-4">
        {placesForSelectedDate.map((place, index) => (
          <PlaceCard
            key={`${place.id}_${index}`}
            index={index}
            place={place}
            budget={budget}
            handleBudgetChange={handleBudgetChange}
            userNotes={userNotes}
            handleNoteChange={handleNoteChange}
            handleTimeFrameChange={handleTimeFrameChange}
            onRemoveButtonClick={onRemoveButtonClick}
          />
        ))}
        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg">
              <p>Are you sure you want to remove this place?</p>
              <div className="flex justify-end mt-2">
                <button 
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                  onClick={removePlace}
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
}

export default PlanCreator;
