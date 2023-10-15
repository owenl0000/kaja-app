import Image from 'next/image'
import Header from '../components/Header.js';
import Filters from "../components/Filters";
import Sidebar from "@/components/Sidebar";
import dynamic from 'next/dynamic';
import CommonAncestor from '@/components/CommonAncenstor.js';
import React, { useState, useEffect } from 'react';

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
  
    const DraggableSectionsWrapper = dynamic(
        () => import('@/components/DraggableSectionsWrapper'),
        { ssr: false }
      );

    return (
        <>

            <Header page="AfterSearch"/>
            <div className="flex min-h-screen h-full">
                <div className="w-1/4">
                    <Sidebar />
                </div>
                <div className="w-3/4">
                    <DraggableSectionsWrapper onAddPlace={handleAddPlace} />
                    <CommonAncestor onAddPlace={handleAddPlace} addedPlaces={addedPlaces} />      

                </div>
            </div>

        </>
    )
}
