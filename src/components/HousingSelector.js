import React, { useState, useEffect } from 'react';
import axios from 'axios';


function HousingSelector({ selectedDate, handleHousingChange, session }) {
  const defaultEntry = [{ type: '', price: '', notes: '', address: '' }];
  const [housingEntries, setHousingEntries] = useState(defaultEntry);
  console.log("::::", housingEntries);

  useEffect(() => {
    async function fetchHousingData() {
      if(session) {
        try {
          const response = await axios.get(`/api/housing?date=${selectedDate}`);
          //console.log("response", response)
          setHousingEntries(response.data.length > 0 ? response.data : defaultEntry);
          console.log("Try", housingEntries);

        } catch(error) {
          if(error.response && error.response.status === 404) {
            setHousingEntries(defaultEntry);
          } else {
            console.error("Failed to fetch housing data:", error);
          }
        }
      } else {
        const storedHousingData = JSON.parse(localStorage.getItem('housingData')) || {};
        const housingForDate = storedHousingData[selectedDate] || defaultEntry;
        setHousingEntries(housingForDate.length > 0 ? housingForDate : defaultEntry);
      }
    }

    fetchHousingData();
  }, [selectedDate, session]);

  const handleEntryChange = (index, field, value) => {
    let newEntries = [...housingEntries];
    console.log("newEntries", newEntries)
    
    if (value === "remove") {
      newEntries.splice(index, 1);
    } else {
      newEntries[index] = { ...newEntries[index], [field]: value };
    }
  
    setHousingEntries(newEntries);
    handleHousingChange(selectedDate, newEntries);
  };

  const addHousingEntry = () => {
    setHousingEntries([...housingEntries, { type: '', price: '', notes: '', address: '' }]);
  };

  return (
    <div className="bg-white px-4 pt-2 pb-1 small:p-4 rounded-lg shadow-md mx-auto text-center mb-6 small:mb-5 ">
      <h3 className="text-lg font-semibold text-gray-700 mb-1 small:mb-3">Housing for {selectedDate}</h3>
      <div className="h-32 overflow-y-auto overflow-x-hidden w-full xl:h-auto">
        {housingEntries.map((entry, index) => (
          <div key={index} className="mb-2 small:mb-4">
            <select
              className="bg-gray-200 rounded small:p-2 p-1 mr-2 w-full"
              value={entry.type || ''}
              onChange={(e) => handleEntryChange(index, 'type', e.target.value)}
            >
              <option value="">Select Housing</option>
              <option value="Hotel">Hotel</option>
              <option value="Airbnb">Airbnb</option>
              <option value="Hostel">Hostel</option>
              <option value="Rental">Rental</option>
              {housingEntries.length > 1 && <option value="remove">Remove</option>}
              {/* Add more housing types */}
            </select>
            <div className="flex rounded">
              <input
                className="bg-gray-200 rounded p-2 w-full mt-2"
                type="text"
                placeholder="Address"
                value={entry.address || ''}
                onChange={(e) => handleEntryChange(index, 'address', e.target.value)}
              />
            </div>
            <div className="flex mt-2 rounded">
              <span className="bg-gray-200 rounded-l p-2 flex items-center text-gray-700">$</span>
              <input
                className="bg-gray-200 rounded-r rounded-l-none p-2 w-full"
                type="text"
                pattern="\d*"
                placeholder="Price"
                value={entry.price  || ''}
                onChange={(e) => handleEntryChange(index, 'price', e.target.value)}
              />
            </div>
            <div className="flex">
            <textarea
              className="bg-gray-200 rounded p-2 w-full mt-2 resize-none"
              type="text"
              placeholder="Notes (optional)"
              value={entry.notes || ''}
              onChange={(e) => handleEntryChange(index, 'notes', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        className="bg-coral text-white p-2 rounded small:mt-2 hover:bg-coral-dark"
        onClick={addHousingEntry}
      >
        Add More Housing
      </button>
    </div>
  );
}

export default HousingSelector;
