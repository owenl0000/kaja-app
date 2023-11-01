import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PlanCreator from '../components/PlanCreator';
import Calendar from '../components/Calendar'; // Import the Calendar component

const Planner = () => {
  const [addedPlaces, setAddedPlaces] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // State to hold the selected date
  const [viewMode, setViewMode] = useState('day'); // State to hold the view mode ('day' or 'week')

  useEffect(() => {
    const savedPlaces = localStorage.getItem('addedPlaces');
    if (savedPlaces) {
      setAddedPlaces(JSON.parse(savedPlaces));
    }
  }, []);

  return (
    <>
      <Header page="Planner" />
      <main className="p-4">
        <div className="flex mb-4">
          <div className="flex-1">
            <Calendar setSelectedDate={setSelectedDate} />
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="flex mt-4">
              <button 
                className={`px-4 py-2 ${viewMode === 'day' ? 'bg-coral text-white' : 'bg-gray-200'}`} 
                onClick={() => setViewMode('day')}
              >
                Day
              </button>
              <button 
                className={`px-4 py-2 ${viewMode === 'week' ? 'bg-coral text-white' : 'bg-gray-200'}`} 
                onClick={() => setViewMode('week')}
              >
                Week
              </button>
            </div>
          </div>
        </div>
        <PlanCreator addedPlaces={addedPlaces} selectedDate={selectedDate} viewMode={viewMode} />
      </main>
    </>
  );
};

export default Planner;
