import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PlanCreator from '../components/PlanCreator';

const Planner = () => {
  const [addedPlaces, setAddedPlaces] = useState([]);

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
        <PlanCreator addedPlaces={addedPlaces}/>
      </main>
    </>
  );
};

export default Planner;
