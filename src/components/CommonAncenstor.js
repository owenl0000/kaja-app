// components/CommonAncestor.js
import React, { useState } from 'react';
import Recommendations from './Recommendations';
import Planner from '@/pages/Planner';

const CommonAncestor = ({ onAddPlace, addedPlaces }) => {
    console.log("Current addedPlaces:", addedPlaces);
  return (
    <div>
      <Recommendations type="someType" onAddPlace={onAddPlace} />
      <Planner addedPlaces={addedPlaces} />
    </div>
  );
};

export default CommonAncestor;
