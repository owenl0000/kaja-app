import React, { useState } from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faClipboardList } from '@fortawesome/free-solid-svg-icons';


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
  const [isAboutOpen, setAboutOpen] = useState(false);
  const [isContactOpen, setContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isSpecialPage = page === 'AfterSearch' || page === 'Planner';
  const headerClass = isSpecialPage ? 'bg-white border-b border-gray-300 text-black' : 'sm:bg-opacity-0 bg-red-400 text-off-white';
  const navClass = isSpecialPage ? 'text-black' : 'text-off-white';
  const positionClass = isSpecialPage ? ' ' : 'absolute';
  const imgClass = isSpecialPage ? "/kaja-logo-black.png" : "/kaja-logo-white.png";

  const aboutClick = () => {
    setAboutOpen(!isAboutOpen);
    setContactOpen(false);
  }

  const contactClick = () => {
    setContactOpen(!isContactOpen);
    setAboutOpen(false);
  }

  return (
    <header className={`grid grid-rows-2 small:grid small:grid-cols-3 items-start w-full flex-grow h-auto sm:h-20 ${headerClass} pt-3 pb-2 lg:px-10 md:px-4 sm:px-2 ${positionClass}  z-10 `}>
      <div className='pt-2 col-start-1'>
        <Link href={"/"} className={""}>
          <div className={"flex items-center lg:items-start gap-x-4"}>
            <h6 className={"text-2xl lg:text-4xl small:text-3xl font-latto font-bold"}>Kaja</h6>
            <div><img className={"small:h-12 h-8 quick-spin"} src={imgClass} alt={"kaja-logo"}/></div>
          </div>
        </Link>
      </div>
      
      <div className="small:pt-2 pt-5 w-full row-start-2 small:row-start-auto col-span-2 small:col-span-1">
        <SearchBar />
      </div>

      <div className={`w-full lg:w-auto lg:flex-shrink lg:block lg:pt-2 col-start-2 small:col-start-3`}>
        <nav className={`flex flex-col justify-end lg:flex-row items-start ${isSpecialPage ? 'gap-2' : 'gap-6'} w-full ${navClass} lg:mr-16`}>
            <button className="justify-end lg:hidden ml-auto mt-3 " onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            {/* For large screens */}
            <Link href="/" className="font-mont mb-1 pt-2 lg:inline sm:hidden text-select" onClick={() => { setAboutOpen(false); setContactOpen(false); }}>Home</Link>
            <div className={`font-mont mb-1 hidden pt-2 xl:inline flex-col overflow-hidden ${isSpecialPage ? 'hidden w-0' : 'flex'}`}>
              <button onClick={aboutClick} className={`text-select text-center`}>About</button>
              <div className={`${isAboutOpen ? "nav-open" : "nav-closed"} backdrop-blur-md p-4 pt-2 text-center z-50 h-[12rem] rounded-lg overflow-scroll no-scrollbar`}>
                Kaja is a web application in development that aims to simplify planning for trips and outings.
                With Kaja, users can get a straightforward itinerary based on their interests, budget, and time.
                Unlike many existing travel apps that offer a wide array of options but leave the hard work of planning to the user, Kaja focuses on streamlining this process to make decision-making easier.
              </div>
            </div>
            <div className={`font-mont mb-1 hidden pt-2 xl:inline flex-col overflow-hidden ${isSpecialPage ? 'hidden w-0' : 'flex'}`}>
              <div onClick={contactClick} className={"text-select text-center"}>Contact</div>
              <div className={`${isContactOpen ? "nav-open" : "nav-closed"} backdrop-blur-md p-4 pt-2 text-center z-50 max-h-[12rem] rounded-lg overflow-scroll no-scrollbar`}>
                <ul>
                  <li>Brandon Vasquez</li>
                  <li>Owen Liang</li>
                  <li>Darryl Nurse</li>
                </ul>
              </div>
            </div>
            <Link href="/Planner" className="font-mont bg-coral px-1 p-2 cursor-pointer rounded-md items-center lg:inline hidden text-off-white text-select">
              Planner
            </Link>
            {/* For small screens */}
            <div className={`lg:hidden flex flex-col font-mont items-end gap-y-1 w-full text-center ${isMenuOpen ? 'open' : 'closed'} z-20`}>
                <Link href="/" className="w-1/2 bg-coral text-white sm:text-[7px] small:text-base p-2 rounded overflow-visible flex items-center justify-center shadow-sm shadow-black text-select">
                  <FontAwesomeIcon icon={faHome} className="small:mr-2 hidden small:inline" />Home
                </Link>
                <Link href="/Planner" className="w-1/2 bg-coral text-white sm:text-[7px] small:text-base p-2 rounded overflow-visible flex items-center justify-center shadow-sm shadow-black text-select">
                  <FontAwesomeIcon icon={faClipboardList} className="small:mr-2 hidden small:inline" /> Planner
                </Link>
            </div>
          </nav>
      </div>

    </header>
  );
}

export default Header;
