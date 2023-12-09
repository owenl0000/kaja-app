import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, "../../.env")}); //get the configs from the .env file

const SearchBar = () => {
  const [placeName, setPlaceName] = useState('');
  const [activity, setActivity] = useState('');
  const [url, setUrl] = useState('placeName=&location=');
  const router = useRouter();

  const updateUrl = () => {
    setUrl(`placeName=${ placeName || '' }&activity=${ activity || '' }`);
  }

  //what we can do here is to actually fetch 

  const handleSearch = e => {
    console.log(`Searching for ${activity} in ${placeName}`);
    updateUrl();
    router.push({
      pathname: '/AfterSearch',
      query: { placeName, location: activity },
    });
    e.preventDefault();
  };

  return (
    <form className="flex sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 rounded z-10"
          onSubmit={handleSearch}>

      {/*
      get url screen from React as a string
      ex. placeName=&location=hello
      */}

      <input
          type="text"
          placeholder="Where to?"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          className="w-[100px] sm:w-[150px] sm:p-2 sm:flex-grow sm:flex-shrink sm:border-r border border-r-0 text-black rounded-l"
          required={true}
      />

      {/*set custom message setCustomValidity*/}

      <input
          type="text"
          placeholder="What will you do?"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="w-[100px] sm:w-[150px] sm:p-2 sm:flex-grow sm:flex-shrink sm:border-r border border-r-0 text-black"
          required={true}
      />

      <button
              className="bg-coral active:bg-[var(--dark-coral)] border border-l-0 text-off-white p-2 rounded-r flex-shrink-0"
              type={"submit"}>
        Search
      </button>

    </form>
  );
};

export default SearchBar;
