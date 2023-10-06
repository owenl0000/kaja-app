"use client"

import React from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';

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
  const headerClass = page === 'AfterSearch' ? 'bg-white border-b border-gray-300 text-black' : 'bg-opacity-0 text-off-white';
  const navClass = page === 'AfterSearch' ? 'text-black' : 'text-off-white';
  const positionClass = page === 'AfterSearch' ? ' ' : 'absolute';

  return (
    <header className={`flex justify-between items-center h-20 ${headerClass} font-trend lg:px-10 md:px-4 sm:px-2 ${positionClass} w-full z-10`}>
      <div className="flex items-center">
        <h6 className="text-4xl m-0 mb-4 lg:text-4xl md:text-3xl sm:text-2xl">Kaja</h6>
      </div>
      <SearchBar /> 
      <nav className={`flex gap-6 items-center mr-16 text-sm ${navClass}`}>
        {/* For large screens */}
        <Link href="/" className="font-trend mb-2 lg:inline hidden">Home</Link>
        <a href="#About" onClick={handleSmoothScroll} className="font-trend mb-2 lg:inline hidden">About</a>
        <a href="#Iteneries" onClick={handleSmoothScroll} className="font-trend mb-2 lg:inline hidden">Itineries</a>
        <a href="#Contact" onClick={handleSmoothScroll} className="font-trend mb-2 lg:inline hidden">Contact</a>
        <Link href="/AfterSearch" className="font-trend bg-coral border pb-3 px-1 p-2 cursor-pointer rounded-md items-center lg:inline hidden text-off-white">
          Planner
        </Link>

        {/* For small screens */}
        <Link href="/" className="lg:hidden">
          
        </Link>
        <Link href="/Itineries" className="lg:hidden">
          
        </Link>
        <Link href="/AfterSearch" className="bg-coral text-off-white border pb-3 px-1 p-2 cursor-pointer rounded-md flex items-center lg:hidden">
          
        </Link>
      </nav>
    </header>
  );
}

export default Header;
