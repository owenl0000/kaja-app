import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, "../../.env")}); //get the configs from the .env file

const SearchBar = () => {
  const [location, setLocation] = useState('');
  const [activity, setActivity] = useState('');
  const router = useRouter();


  //fetch(http://${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/populate?${url})

  const updateUrl = () => {
    setUrl(`location=${ location || '' }&activity=${ activity || '' }`);
  }

  useEffect(() => {
    // Check if the router is ready and has query parameters
    if (router.isReady) {
      const { location: locationParam, activity: activityParam } = router.query;
      setLocation(locationParam || '');
      setActivity(activityParam || '');
    }
  }, [router.isReady, router.query]);
  //what we can do here is to actually fetch 
  useEffect(() => {
    if (location && activity) {
      const fetchUrl = `http://${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/populate?location=${encodeURIComponent(location)}&activity=${encodeURIComponent(activity)}`;
      fetch(fetchUrl)
        .then(res => res.json()) // Handle response here if needed
        .catch(err => console.error(err)); // Handle error here if needed
    }
  }, [location, activity]);

  const handleSearch = e => {
    e.preventDefault();
    console.log(`Searching for, ${activity} in ${location}`);

      // Directly use router.push to navigate to the new page with query parameters
    router.push({
      pathname: '/AfterSearch',
      query: { location: location, activity: activity },
    });
  };

return (
    <form className="flex w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 rounded z-10"
          onSubmit={handleSearch}>

      {/*
      get url screen from React as a string
      ex. placeName=&location=hello
      */}

      <input
          type="text"
          placeholder="Where to?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-[100px] sm:w-[150px] sm:p-2 sm:flex-grow sm:flex-shrink sm:border-r border border-r-0 text-black rounded-l"
          required={true}
      />

      <input
          type="text"
          placeholder="What will you do?"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="w-[100px] sm:w-[150px] sm:p-2 sm:flex-grow sm:flex-shrink sm:border-r border border-r-0 text-black"
      />

      <button type={"submit"} className="bg-coral active:bg-[var(--dark-coral)] border border-l-0 text-off-white p-2 rounded-r flex-shrink-0">
        Search
      </button>

    </form>
  );
}

export default SearchBar;