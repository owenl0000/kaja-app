import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { data } from 'autoprefixer';
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, "../../.env")}); //get the configs from the .env file

const SearchBar = () => {
  const [location, setLocation] = useState('');
  const [activity, setActivity] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if the router is ready and has query parameters
    if (router.isReady) {
      const { location: locationParam, activity: activityParam } = router.query;
      setLocation(locationParam || '');
      setActivity(activityParam || '');
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    const lastSearch = sessionStorage.getItem('lastSearch');
    if (lastSearch) {
      const { location: lastLocation, activity: lastActivity } = JSON.parse(lastSearch);
      setLocation(lastLocation || '');
      setActivity(lastActivity || '');
    }
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    console.log(`Searching for, ${activity} in ${location}`);

    sessionStorage.setItem('lastSearch', JSON.stringify({ location, activity }));

    // Fetch data when Search is clicked
    router.push({
      pathname: '/AfterSearch',
      query: { location , activity },
    });

    // Use router.push to navigate to the new page with query parameters
  };

  return (
      <form className="flex small:w-full z-5 font-mont"
            onSubmit={handleSearch}>

        <input
            type="text"
            placeholder="Where to?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className=" sm:w-[40%] small:w-[150px] small:p-2 pl-2 small:flex-grow text-xs small:text-sm xl:text-base small:flex-shrink small:border-r border border-r-0 text-black rounded-l rounded-r-none"
            required={true}
        />

        <input
            type="text"
            placeholder="What will you do?"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="sm:w-[40%] small:w-[150px] small:p-2 pl-2 small:flex-grow text-xs small:text-sm xl:text-base small:flex-shrink small:border-r border rounded-none border-r-0 text-black"
        />

        <button type={"submit"} className="w-[20%] small:w-auto bg-coral active:bg-[var(--dark-coral)] border font-latto border-l-0 text-off-white p-2 rounded-r text-xs small:text-base">
          Search
        </button>

      </form>
  );
}

export default SearchBar;