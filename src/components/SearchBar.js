import React, { useState } from 'react';
import { useRouter } from 'next/router';

const SearchBar = () => {
  const [placeName, setPlaceName] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    console.log(`Searching for ${placeName} in ${location}`);
    router.push({
      pathname: '/AfterSearch',
      query: { placeName, location },
    });
  };

  return (
    <div className="flex w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 border rounded">
      <input 
        type="text" 
        placeholder="Name of place" 
        value={placeName}
        onChange={(e) => setPlaceName(e.target.value)}
        className="w-[100px] sm:w-[150px] sm:p-2 sm:flex-grow sm:flex-shrink sm:border-r sm:rounded-l text-black"
      />
      <div className="border-l h-full flex-shrink-0"></div>
      <input 
        type="text" 
        placeholder="Location" 
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-[100px] sm:w-[150px] sm:p-2 sm:flex-grow sm:flex-shrink sm:border-r text-black"
      />
      <button onClick={handleSearch} className="bg-coral text-off-white p-2 rounded-r flex-shrink-0">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
