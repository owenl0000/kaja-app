"use client"

import React from 'react';
import Link from 'next/link';

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


function Header() {
  return (
    <header className="flex justify-between items-center h-20 bg-blue-900 text-turquoise-400 font-trend lg:px-10 md:px-4 sm:px-2">
      <div className="flex items-center">
        <h6 className="text-4xl m-0 mb-4 lg:text-4xl md:text-3xl sm:text-2xl">Kaja</h6>
      </div>
      <nav className="flex gap-6 items-center mr-16 text-sm">
        {/* For large screens */}
        <Link href="/" className="font-trend mb-2 lg:inline hidden">Home</Link>
        <a href="#About" onClick={handleSmoothScroll} className="font-trend mb-2 lg:inline hidden">About</a>
        <a href="#Iteneries" onClick={handleSmoothScroll} className="font-trend mb-2 lg:inline hidden">Iteneries</a>
        <a href="#Contact" onClick={handleSmoothScroll} className="font-trend mb-2 lg:inline hidden">Contact</a>
        <a href="/plan" className="font-trend bg-turquoise text-off-white border pb-3 px-1 p-2 cursor-pointer rounded-md flex items-center lg:inline hidden">
          Planner
        </a>

        {/* For small screens */}
        <Link href="/" className="lg:hidden">
          
        </Link>
        <a href="/gallery" className="lg:hidden">
          
        </a>
        <a href="/cartoonize" className="bg-turquoise text-off-white border pb-3 px-1 p-2 cursor-pointer rounded-md flex items-center lg:hidden">
          
        </a>
      </nav>
    </header>
  );
}

export default Header;
