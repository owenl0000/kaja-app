import React, { useState, useEffect } from 'react';

function HousingSelector({ selectedDate, handleHousingChange }) {
  const [housingEntries, setHousingEntries] = useState([{ type: '', price: '' }]);

  useEffect(() => {
    // Fetch the stored housing data for the selected date
    const storedHousingData = JSON.parse(localStorage.getItem('housingData')) || {};
    const housingForDate = storedHousingData[selectedDate] || [{ type: '', price: '' }];

    // Set the fetched data to the state
    setHousingEntries(housingForDate);
  }, [selectedDate]);

  const handleEntryChange = (index, field, value) => {
    if (value === "remove") {
      // Remove the entry if "Remove" option is selected
      const newEntries = housingEntries.filter((_, i) => i !== index);
      setHousingEntries(newEntries);
      handleHousingChange(selectedDate, newEntries);
    } else {
      // Update the entry with new type or price
      const newEntries = housingEntries.map((entry, i) => {
        if (i === index) {
          return { ...entry, [field]: value };
        }
        return entry;
      });
      setHousingEntries(newEntries);
      handleHousingChange(selectedDate, newEntries);
    }
  };

  const addHousingEntry = () => {
    setHousingEntries([...housingEntries, { type: '', price: '' }]);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-sm mx-auto text-center mb-5">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Housing for {selectedDate}</h3>
      {housingEntries.map((entry, index) => (
        <div key={index} className="flex items-center mb-2">
          <select
            className="bg-gray-200 rounded p-2 mr-2 flex-1"
            value={entry.type}
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
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-700">$</span>
            <input
              className="bg-gray-200 rounded p-2 pl-6 w-full"
              type="text"
              pattern="\d*"
              placeholder="Price"
              value={entry.price}
              onChange={(e) => handleEntryChange(index, 'price', e.target.value)}
            />
          </div>
        </div>
      ))}
      <button
        className="bg-coral text-white p-2 rounded mt-4 hover:bg-coral-dark"
        onClick={addHousingEntry}
      >
        Add More Housing
      </button>
    </div>
  );
}

export default HousingSelector;
