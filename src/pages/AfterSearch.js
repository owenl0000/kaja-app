import Image from 'next/image'
import Header from '../components/Header.js';
import Filters from "../components/Filters";
import Sidebar from "@/components/Sidebar";
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import Recommendations from '@/components/Recommendations.js';


export default function AfterSearch() {

  const [addedPlacesByDate, setAddedPlacesByDate] = useState([]);


  // Read places from localStorage on mount
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

  const handleAddPlace = (place, selectedDate) => {
    const index = addedPlacesByDate.findIndex(entry => entry.date === selectedDate);
    let newAddedPlaces;
 
    if (index > -1) {
      // Date already exists, update the places array for this date
      newAddedPlaces = [...addedPlacesByDate];
      newAddedPlaces[index].places.push(place);
    } else {
      // Date does not exist, add new entry
      newAddedPlaces = [...addedPlacesByDate, { date: selectedDate, places: [place] }];
    }
  
    setAddedPlacesByDate(newAddedPlaces);
    localStorage.setItem('addedPlacesByDate', JSON.stringify(newAddedPlaces));
  };
  
  return (
      <>

          <Header page="AfterSearch"/>
          <div className="flex min-h-screen h-full">
              <div className="w-1/4">
                  <Sidebar />
              </div>
              <div className="w-3/4">
                <Recommendations onAddPlace={(place) => handleAddPlace(place, new Date().toISOString().split('T')[0])} />   
              </div>
          </div>

      </>
  )
}
