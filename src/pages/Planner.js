import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PlanCreator from '../components/PlanCreator';
import Calendar from '../components/CalendarChange';
import MakePlace from '@/components/MakePlace';

const Planner = () => {
  const [addedPlacesByDate, setAddedPlacesByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // State to hold the selected date
  console.log(selectedDate);

  useEffect(() => {
    const savedDate = sessionStorage.getItem('selectedDate');
    if (savedDate) {
      setSelectedDate(savedDate);
    }
  }, []);
  
  useEffect(() => {
    const savedPlaces = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
    console.log('Fetched data from localStorage:', savedPlaces);
    setAddedPlacesByDate(savedPlaces);
  }, [selectedDate]);

  useEffect(() => {
    console.log('Places updated:', addedPlacesByDate);
    // Trigger an update to PlanCreator if needed
  }, [addedPlacesByDate]);


  const formatDateToString = (dateObj) => {
    // Assuming dateObj is an object like {year: 2023, month: "January", day: 18}
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const monthIndex = monthNames.indexOf(dateObj.month) + 1;
    return `${dateObj.year}-${String(monthIndex).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`;
  };

  const handleDateChange = (newDateObject) => {
    const formattedDate = formatDateToString(newDateObject);
    setSelectedDate(formattedDate);
    sessionStorage.setItem('selectedDate', formattedDate);
  };
  

  const handleAddPlace = (newPlace, date) => {
    console.log("Received place:", newPlace);

    // Fetch the latest addedPlacesByDate from localStorage
    const currentAddedPlaces = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};

    // Check if the newPlace has an ID and if it already exists for the selected date
    const existingPlaceIndex = currentAddedPlaces[date]?.findIndex(place => place.id === newPlace.id);

    if (existingPlaceIndex >= 0) {
      // Update the existing place
      currentAddedPlaces[date][existingPlaceIndex] = newPlace;
    } else {
      // Generate a unique ID if the new place doesn't have one and add as new
      const placeWithId = newPlace.id ? newPlace : { ...newPlace, id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
      currentAddedPlaces[date] = [...(currentAddedPlaces[date] || []), placeWithId];
    }

    // Update state and localStorage
    setAddedPlacesByDate(currentAddedPlaces);
    localStorage.setItem('addedPlacesByDate', JSON.stringify(currentAddedPlaces));
  };




  const placesForSelectedDate = addedPlacesByDate[selectedDate] || [];
  console.log('Places for selected date:', placesForSelectedDate);

  return (
      <>
        <Header page="Planner" />
        <div className="flex flex-col justify-center items-center">
          <main className="p-4 mx-auto small:ml-0">
            <div className="grid md:grid-cols-2 sm:grid-cols-1 mb-4 ">
              <div className="flex-1 flex justify-center">
                <div className={"sm:w-3/4 lg:w-1/2"}>
                  < Calendar selectedDate={selectedDate} setSelectedDate={handleDateChange}/>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex rounded-md overflow-hidden sm:w-3/4 lg:w-1/2">
                  <MakePlace onAddPlace={handleAddPlace} selectedDate={selectedDate} />
                </div>
              </div>
            </div>
            <PlanCreator
                selectedDate={selectedDate}
                addedPlacesByDate={addedPlacesByDate}
            />
          </main>
        </div>
      </>
  );
};

export default Planner;