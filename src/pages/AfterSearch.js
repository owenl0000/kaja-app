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
  console.log(selectedDate);
  // Read places from localStorage on mount

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
          <div className="flex min-h-screen h-full font-mont">
              <div className="w-1/4">
                  <Sidebar 
                    selectedDate={selectedDate} 
                    onDateChange={handleDateChange}
                    onSortChange={handleSortOrderChange}
                    onPriceChange={handlePriceChange}
                  />
              </div>
              <div className="w-3/4">
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
