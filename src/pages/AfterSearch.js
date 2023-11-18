import Image from 'next/image'
import Header from '../components/Header.js';
import Filters from "../components/Filters";
import Sidebar from "@/components/Sidebar";
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import Recommendations from '@/components/Recommendations.js';


export default function AfterSearch() {
    const [addedPlaces, setAddedPlaces] = useState([]);

    useEffect(() => {
      const savedPlaces = localStorage.getItem('addedPlaces');
      if (savedPlaces) {
        setAddedPlaces(JSON.parse(savedPlaces));
      }
    }, []);
  
    useEffect(() => {
      localStorage.setItem('addedPlaces', JSON.stringify(addedPlaces));
    }, [addedPlaces]);

    const handleAddPlace = (place) => {
        console.log("AfterSearch: Adding place:", place);
        setAddedPlaces([...addedPlaces, place]);
    };

    return (
        <>

            <Header page="AfterSearch"/>
            <div className="flex min-h-screen h-full">
                <div className="w-1/4">
                    <Sidebar />
                </div>
                <div className="w-3/4">
                  <Recommendations onAddPlace={handleAddPlace} />   
                </div>
            </div>

        </>
    )
}
