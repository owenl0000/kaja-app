import React, { useState } from 'react';

const SearchBar = () => {
  const [placeName, setPlaceName] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    // Implement search logic here
    console.log(`Searching for ${placeName} in ${location}`);
  };

  return (
    <div className="flex items-center border rounded">
      <input 
        type="text" 
        placeholder="Name of place" 
        value={placeName}
        onChange={(e) => setPlaceName(e.target.value)}
        className="p-2 flex-grow border-r outline-none"
      />
      <div className="border-l h-full"></div>
      <input 
        type="text" 
        placeholder="Location" 
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="p-2 flex-grow outline-none"
      />
      <button onClick={handleSearch} className="bg-coral text-off-white p-2 rounded-r">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
