import Image from 'next/image'
import Header from '../components/Header.js';
import Sidebar from "@/components/Sidebar";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Recommendations from '@/components/Recommendations.js';
import { useSession } from 'next-auth/react';




export default function AfterSearch() {
  const [addedPlacesByDate, setAddedPlacesByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sortOrder, setSortOrder] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  console.log(selectedDate);
  // Read places from localStorage on mount
  const { data: session, status } = useSession();
  console.log(session, status);



  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const savedDate = sessionStorage.getItem('selectedDate');
    if (savedDate) {
      setSelectedDate(savedDate);
    }
  }, []);

  const handleSortOrderChange = (newOrder) => {
    setSortOrder(newOrder);
  };

  const handlePriceChange = (newPrice) => {
    setPriceFilter(newPrice);
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



  /* const handleAddPlace = async (newPlace, date) => {
    const updatedPlaces = [...(addedPlacesByDate[date] || []), newPlace];
    if (session) {
      try {
        await axios.post('/api/plans', { userId: session.user.id, details: newPlace, date });
        // Update state only after successful API call
        setAddedPlacesByDate(prevState => ({
          ...prevState,
          [date]: updatedPlaces
        }));
      } catch (error) {
        console.error('Failed to save plan:', error);
      }
    } else {
    // localStorage.setItem('addedPlacesByDate', JSON.stringify(newAddedPlaces)); // Uncomment if you need to use localStorage
    }
  }; */



  /* const handleAddPlace = async (newPlace, date) => {
    const uniqueId = generateUniqueId();  // Generate unique ID for the new place

    // Incorporate the uniqueId at the plan level
    const updatedPlace = {
        ...newPlace,
        uniqueId: uniqueId  // Include uniqueId directly with place details
    };

    const updatedPlaces = [...(addedPlacesByDate[date] || []), updatedPlace];
    
    if (session) {
        try {
            await axios.post('/api/plans', {
                userId: session.user.id,
                details: updatedPlace, // send the updated place details including the uniqueId
                date,
                uniqueId  // this is assuming your backend can accept uniqueId at the top level for a plan
            });
            // Update state only after successful API call
            setAddedPlacesByDate(prevState => ({
                ...prevState,
                [date]: updatedPlaces
            }));
        } catch (error) {
            console.error('Failed to save plan:', error);
        }
    } else {
        // Handle local storage for unauthenticated users
        const allPlacesByDate = JSON.parse(localStorage.getItem('addedPlacesByDate')) || {};
        allPlacesByDate[date] = updatedPlaces;
        localStorage.setItem('addedPlacesByDate', JSON.stringify(allPlacesByDate));
    }
}; */

  
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

  return (
      <>
        <Header page="AfterSearch"/>
          <button 
            className="lg:hidden fixed z-30 bottom-4 right-4 bg-coral text-white p-2 rounded-md"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >{isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
          </button>
          <div className="flex min-h-screen h-full font-mont lg:flex-col xl:flex-row">
              <div className={`transform w-full xl:w-1/4 bg-white lg:static fixed  ease-in-out transition-all duration-300 z-20 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                  <Sidebar 
                    selectedDate={selectedDate} 
                    onDateChange={handleDateChange}
                    onSortChange={handleSortOrderChange}
                    onPriceChange={handlePriceChange}
                  />
              </div>
              <div className="w-full lg:ml-0 xl:ml-0 xl:w-3/4">
                <Recommendations 
                  onAddPlace={(place) => handleAddPlace(place, selectedDate)} 
                  sortOrder={sortOrder}
                  priceFilter={priceFilter}
                />   
              </div>
          </div>
      </>
  )
}
