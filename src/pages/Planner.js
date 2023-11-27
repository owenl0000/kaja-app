import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PlanCreator from '../components/PlanCreator';
import Calendar from '../components/CalendarChange';

const Planner = () => {
  const [addedPlacesByDate, setAddedPlacesByDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // State to hold the selected date
  const [viewMode, setViewMode] = useState('day'); // State to hold the view mode ('day' or 'week')
  console.log(selectedDate);

  useEffect(() => {
    const savedPlaces = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
    console.log('Fetched data from localStorage:', savedPlaces);
    setAddedPlacesByDate(savedPlaces);
  }, [selectedDate]);

  const placesForSelectedDate = addedPlacesByDate[selectedDate] || [];
  console.log('Places for selected date:', placesForSelectedDate);

  return (
    <>
      <Header page="Planner" />
      <main className="p-4"> 
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 mb-4 w-full">
          <div className=" flex justify-center">
            <div className={"lg:w-1/2 sm:w-full"}>
              <Calendar setSelectedDate={setSelectedDate}/>
            </div>
          </div>
          <div className=" flex flex-col items-center justify-center">
            <div className="grid grid-cols-2 rounded-md overflow-hidden">
              <button 
                className={`px-12 py-5 transition-colors ${viewMode === 'day' ? 'bg-coral text-white' : 'bg-gray-200'}`}
                onClick={() => setViewMode('day')}
              >
                Day
              </button>
              <button 
                className={`px-4 py-2 transition-colors ${viewMode === 'week' ? 'bg-coral text-white' : 'bg-gray-200'}`}
                onClick={() => setViewMode('week')}
              >
                Week
              </button>
            </div>
          </div>
        </div>
        <PlanCreator 
          addedPlaces={placesForSelectedDate}
          selectedDate={selectedDate} 
        />
      </main>
    </>
  );
};

export default Planner;
