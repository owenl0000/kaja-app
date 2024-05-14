import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransportationSelector({ selectedDate, handleTransportationChange, session }) {
  const defaultEntry = [{ type: '', price: '', notes: '' }];
  const [transportationEntries, setTransportationEntries] = useState(defaultEntry);
  //console.log("::::", transportationEntries);

  useEffect(() => {
    async function fetchTransportationData() {
      if (session) {
        try {
          const response = await axios.get(`/api/transportation?date=${selectedDate}`);
          //console.log("response", response)
          setTransportationEntries(response.data.length > 0 ? response.data : defaultEntry);
          
          //console.log("TRY", transportationEntries);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // No transportation data found for the date
            setTransportationEntries(defaultEntry);
          } else {
            console.error("Failed to fetch transportation data:", error);
          }
        }
      } else {
        const storedTransportationData = JSON.parse(localStorage.getItem('transportationData')) || {};
        const transportationForDate = storedTransportationData[selectedDate] || defaultEntry;
        setTransportationEntries(transportationForDate.length > 0 ? transportationForDate : defaultEntry);
      }
    }

    fetchTransportationData();
  }, [selectedDate, session]);

  const handleEntryChange = (index, field, value) => {
    let newEntries = [...transportationEntries];
    //console.log("newEntries", newEntries)
    
    if (value === "remove") {
      newEntries.splice(index, 1);
    } else {
      newEntries[index] = { ...newEntries[index], [field]: value };
    }
  
    setTransportationEntries(newEntries);
    handleTransportationChange(selectedDate, newEntries);
  };
  

  const addTransportationEntry = () => {
    setTransportationEntries([...transportationEntries, { type: '', price: '', notes: '' }]);
  };

  return (
    <div className="bg-white px-4 pt-2 pb-1 small:p-4 rounded-lg shadow-md mx-auto text-center mb-1 small:mb-5">
      <h3 className="text-lg font-semibold text-gray-700 mb-1 small:mb-3">Transportation for {selectedDate}</h3>
      <div className="h-32 overflow-y-auto overflow-x-hidden w-full xl:h-auto">
        {transportationEntries.map((entry, index) => (
          <div key={index} className="mb-2 small:mb-4">
            <select
              className="bg-gray-200 rounded small:p-2 p-1 mr-2 w-full"
              value={entry.type || ''}
              onChange={(e) => handleEntryChange(index, 'type', e.target.value)}
            >
              <option value="">Select Transportation</option>
              <option value="Car">Car</option>
              <option value="Bus">Bus</option>
              <option value="Train">Train</option>
              <option value="Plane">Plane</option>
              {transportationEntries.length > 1 && <option value="remove">Remove</option>}
              {/* Add more transportation types */}
            </select>
            <div className="flex mt-2">
              <span className="bg-gray-200 rounded-l p-2 flex items-center text-gray-700">$</span>
              <input
                className="bg-gray-200 rounded-r rounded-l-none p-2 w-full"
                type="text"
                pattern="\d*"
                placeholder="Price"
                value={entry.price || ''}
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
        onClick={addTransportationEntry}
      >
        Add More Transportation
      </button>
    </div>
  );
}

export default TransportationSelector;
