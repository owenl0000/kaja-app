import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Header from '../components/Header';
import PlanCreator from '../components/PlanCreator';
import Calendar from '../components/CalendarChange';
import MakePlace from '@/components/MakePlace';

const Planner = () => {
  const { data: session } = useSession();
  const [addedPlacesByDate, setAddedPlacesByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // State to hold the selected date
  console.log("addedPlaceByDate in", addedPlacesByDate)

  useEffect(() => {
    const savedDate = sessionStorage.getItem('selectedDate');
    if (savedDate) {
      setSelectedDate(savedDate);
    }

    // Initial fetch from local storage or database based on login status
    const fetchInitialData = async () => {
      if (session) {
        //console.log("Fetching");
        try {
          const response = await axios.get(`/api/plans?userId=${session.user.id}`);
          // Assuming the response.data is an array of plans
          const formattedData = response.data.reduce((acc, plan) => {
            // Assuming 'date' is a property of each plan object
            const { date } = plan;
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(plan);
            return acc;
          }, {});
          setAddedPlacesByDate(formattedData);
          //console.log("Added", formattedData);
        } catch (error) {
          console.error('Failed to fetch plans:', error);
        }
      }
    };
    

    fetchInitialData();
  }, [session, selectedDate]);


  useEffect(() => {
    //console.log('Places updated:', addedPlacesByDate);
    // Trigger an update to PlanCreator if needed
  }, [addedPlacesByDate]);


  const formatDateToString = (dateObj) => {
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
  

   const handleAddPlace = async (newPlace, date) => {
    const existingPlaces = addedPlacesByDate[date] || [];
    const updatedPlaces = [
        ...existingPlaces, 
        { ...newPlace, index: existingPlaces.length }
    ];
    if (session) {
        try {
            // Since uniqueId will now be handled by the backend, you don't need to send it from the front-end
            const response = await axios.post('/api/plans', {
                userId: session.user.id,
                details: newPlace,
                date,
                index: existingPlaces.length
            });
            // Assuming the response includes the newly created plan with the uniqueId
            const updatedPlace = {
                ...newPlace,
                uniqueId: response.data.uniqueId,  // Use the uniqueId provided by the server
                index: existingPlaces.length
            };
            // Replace the last element with updatedPlace containing uniqueId
            updatedPlaces[updatedPlaces.length - 1] = updatedPlace;
            
            // Update state only after successful API call
            setAddedPlacesByDate(prevState => ({
                ...prevState,
                [date]: updatedPlaces
            }));
        } catch (error) {
            console.error('Failed to save plan:', error);
        }
    } else {
        // Handle local storage for unauthenticated users (if you decide to store any temporary data)
        const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
        const updatedPlaces = [...(allPlacesByDate[date] || []), {details: newPlace}]; // Append the new place to the existing array for the date
        allPlacesByDate[date] = updatedPlaces; // Update local storage with the new array of places for the date
        setAddedPlacesByDate(allPlacesByDate);
        localStorage.setItem('addedPlacesByDate', JSON.stringify(allPlacesByDate));
    }
  };


  const placesForSelectedDate = addedPlacesByDate[selectedDate] || [];
  //console.log('Places for selected date:', placesForSelectedDate);

  return (
      <>
        <Header page="Planner" />
        <div className="flex flex-col justify-center items-center">
          <main className="lg:p-4 mx-auto w-full small:ml-0">
            <div className="grid md:grid-cols-2 sm:grid-cols-1 mb-4 ">
              <div className="flex-1 flex justify-center">
                <div className={"sm:w-3/4 lg:w-1/2"}>
                  <Calendar selectedDate={selectedDate} setSelectedDate={handleDateChange}/>
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