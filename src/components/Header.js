import React, { useState } from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMapMarkedAlt, faClipboardList } from '@fortawesome/free-solid-svg-icons';


const handleSmoothScroll = (e) => {
  e.preventDefault();
  const targetId = e.currentTarget.getAttribute("href").substring(1);
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    window.scrollTo({
      top: targetElement.offsetTop,
      behavior: "smooth",
    });
  }
};

function Header({ page }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isSpecialPage = page === 'AfterSearch' || page === 'Planner';
  const headerClass = isSpecialPage ? 'bg-white border-b border-gray-300 text-black' : 'sm:bg-opacity-0 bg-red-400 text-off-white';
  const navClass = isSpecialPage ? 'text-black' : 'text-off-white';
  const positionClass = isSpecialPage ? ' ' : 'absolute';

  return (
    <header className={`flex flex-col sm:flex-row flex-wrap justify-between items-center h-auto sm:h-20 ${headerClass} lg:px-10 md:px-4 sm:px-2 ${positionClass} w-full z-10`}>
      <div className="flex items-center w-full lg:w-auto justify-start lg:justify-start">
        <h6 className="text-4xl m-0 mb-1 lg:text-4xl md:text-3xl sm:text-2xl">Kaja</h6>
        <button className="lg:hidden ml-auto" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <div className="hidden lg:w-auto lg:flex-grow lg:flex lg:justify-center">
        <SearchBar /> 
      </div>
      <div className={`w-full lg:w-auto lg:flex-shrink ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
        <nav className={`flex flex-col lg:flex-row gap-6 items-center ${navClass} lg:mr-16`}>
          {/* For large screens */}
          <Link href="/" className="font-trend mb-1 lg:inline hidden">Home</Link>
          <a href="#About" onClick={handleSmoothScroll} className="font-trend mb-1 lg:inline hidden">About</a>
          <a href="#Iteneries" onClick={handleSmoothScroll} className="font-trend mb-1 lg:inline hidden">Itineraries</a>
          <a href="#Contact" onClick={handleSmoothScroll} className="font-trend mb-1 lg:inline hidden">Contact</a>
          <Link href="/Planner" className="font-trend bg-coral border pb-3 px-1 p-2 cursor-pointer rounded-md items-center lg:inline hidden text-off-white">
            Planner
          </Link>

          {/* For small screens */}
          <Link href="/" className="lg:hidden">
            Home
          </Link>
          <Link href="/Itineries" className="lg:hidden">
            <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-2 lg:hidden" /> Itineraries
          </Link>
          <Link href="/Planner" className="bg-coral text-off-white border pb-3 px-1 p-2 cursor-pointer rounded-md flex items-center lg:hidden">
            <FontAwesomeIcon icon={faClipboardList} className="mr-2 lg:hidden" /> Planner
          </Link>
        </nav>
      </div>
      <div className="lg:hidden">
        <SearchBar /> {/* Made it visible only on small screens */}
      </div>
    </header>
  );
}

export default Header;
