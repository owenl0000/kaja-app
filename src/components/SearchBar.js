import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, "../../.env")}); //get the configs from the .env file

const SearchBar = () => {
  const [placeName, setPlaceName] = useState('');
  const [location, setLocation] = useState('');
  const [url, setUrl] = useState('placeName=&location=');
  const router = useRouter();

  const updateUrl = () => {
    setUrl(`placeName=${ placeName || '' }&location=${ location || '' }`);
  }

  //what we can do here is to actually fetch 

  const handleSearch = () => {
    console.log(`Searching for ${placeName} in ${location}`);
    updateUrl();
    router.push({
      pathname: '/AfterSearch',
      query: { placeName, location },
    });
  };

  return (
    <div className="flex w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 rounded z-10">

      {/*
      get url screen from React as a string
      ex. placeName=&location=hello
      */}

      <input
          type="text"
          placeholder="Place Name"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          className="w-[100px] sm:w-[150px] sm:p-2 sm:flex-grow sm:flex-shrink sm:border-r border border-r-0 text-black rounded-l"
      />

      <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-[100px] sm:w-[150px] sm:p-2 sm:flex-grow sm:flex-shrink sm:border-r border border-r-0 text-black"
      />

      <button onClick={handleSearch} className="bg-coral active:bg-[var(--dark-coral)] border border-l-0 text-off-white p-2 rounded-r flex-shrink-0">
        Search
      </button>

    </div>
  );
};

export default SearchBar;
