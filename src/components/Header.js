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
  const imgClass = isSpecialPage ? "/kaja-logo-black.png" : "/kaja-logo-white.png";

  return (
    <header className={`lg:grid grid-cols-3 items-center h-auto sm:h-20 ${headerClass} pt-2 pb-2 lg:px-10 md:px-4 sm:px-2 ${positionClass} w-full z-10`}>

      <div className="flex sm:grid grid-cols-3 sm:mt-2 w-full items-center lg:w-auto lg:justify-start">

        <Link href={"/"} className={""}>
          <div className={"flex items-center lg:items-start gap-x-4"}>
            <h6 className={"text-4xl mb-1 lg:text-4xl sm:text-3xl"}>Kaja</h6>
            <div><img className={"h-12 quick-spin"} src={imgClass} alt={"kaja-logo"}/></div>
          </div>
        </Link>

        <div className="lg:hidden lg:w-auto lg:flex-grow lg:justify-center">
          <SearchBar />
        </div>

        <button className="lg:hidden ml-auto p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FontAwesomeIcon icon={faBars} />
        </button>

      </div>

      <div className={"w-full sm:hidden lg:flex lg:justify-start lg:pl-12 lg:pt-2"}>
        <SearchBar />
      </div>

      <div className={`w-full lg:w-auto lg:flex-shrink lg:block lg:pt-2`}>
        <nav className={`flex flex-col justify-end lg:flex-row gap-6 items-center w-full ${navClass} lg:mr-16`}>

          {/* For large screens */}
          <Link href="/" className="font-trend mb-1 lg:inline sm:hidden text-select">Home</Link>
          <a href="#About" onClick={handleSmoothScroll} className="font-trend mb-1 lg:inline sm:hidden text-select">About</a>
          <a href="#Iteneries" onClick={handleSmoothScroll} className="font-trend mb-1 lg:inline sm:hidden text-select">Itineraries</a>
          <a href="#Contact" onClick={handleSmoothScroll} className="font-trend mb-1 lg:inline sm:hidden text-select">Contact</a>
          <Link href="/Planner" className="font-trend bg-coral border px-1 p-2 cursor-pointer rounded-md items-center lg:inline sm:hidden text-off-white active:bg-[var(--dark-coral)] text-select">
             Planner
          </Link>

          {/* For small screens */}
          <div className={`lg:hidden flex flex-col items-end gap-y-1 w-full text-center ${isMenuOpen ? 'open' : 'closed'} z-20`}>
              <Link href="/" className="lg:hidden w-1/6 p-2 sm:bg-[var(--coral)] sm:border sm:rounded-md text-select select-none text-white shadow-sm shadow-black">
                Home
              </Link>
              <Link href="/Itineries" className="lg:hidden w-1/6 p-2 sm:bg-[var(--coral)] sm:border sm:rounded-md text-select select-none text-white shadow-sm shadow-black flex justify-end items-center">
                <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-2 lg:hidden" /> Itineraries
              </Link>
              <Link href="/Planner" className="w-1/6 bg-coral text-off-white border p-2 cursor-pointer rounded-md flex items-center justify-center shadow-sm shadow-black lg:hidden active:bg-[var(--dark-coral)] text-select">
                <FontAwesomeIcon icon={faClipboardList} className="mr-2 lg:hidden" /> Planner
              </Link>
          </div>

        </nav>
      </div>

    </header>
  );
}

export default Header;
