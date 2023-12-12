import Image from 'next/image'
import Header from '../components/Header.js';
import Filters from "../components/Filters";
import Sidebar from "@/components/Sidebar";
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import Recommendations from '@/components/Recommendations.js';


export default function AfterSearch() {
  const [addedPlacesByDate, setAddedPlacesByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sortOrder, setSortOrder] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  console.log(selectedDate);
  // Read places from localStorage on mount

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const savedDate = sessionStorage.getItem('selectedDate');
    if (savedDate) {
      setSelectedDate(savedDate);
    }
  }, []);
  
  useEffect(() => {
    const savedPlaces = localStorage.getItem('addedPlacesByDate');
    if (savedPlaces) {
      setAddedPlacesByDate(JSON.parse(savedPlaces));
    }
  }, []);

  // Write places to localStorage when they change
  useEffect(() => {
    localStorage.setItem('addedPlacesByDate', JSON.stringify(addedPlacesByDate));
  }, [addedPlacesByDate]);

  const handleSortOrderChange = (newOrder) => {
    setSortOrder(newOrder);
  };

  const handlePriceChange = (newPrice) => {
    setPriceFilter(newPrice);
  };

  const handleAddPlace = (place, selectedDate) => {
    const newAddedPlaces = { ...addedPlacesByDate };
    if (!newAddedPlaces[selectedDate]) {
      newAddedPlaces[selectedDate] = [];
    }
    newAddedPlaces[selectedDate].push(place);
  
    setAddedPlacesByDate(newAddedPlaces);
    localStorage.setItem('addedPlacesByDate', JSON.stringify(newAddedPlaces));
  };
  
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
              <div className={`transform w-full xl:w-1/4 bg-white lg:static absolute h-full ease-in-out transition-all duration-300 z-20 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                  <Sidebar 
                    selectedDate={selectedDate} 
                    onDateChange={handleDateChange}
                    onSortChange={handleSortOrderChange}
                    onPriceChange={handlePriceChange}
                  />
              </div>
              <div className="w-full small:ml-20 lg:ml-0 xl:ml-0 xl:w-3/4">
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
