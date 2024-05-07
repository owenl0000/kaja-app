import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faClipboardList, faUserCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useSession, signIn, signOut } from "next-auth/react";


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
  const menuRef = useRef(null);
  const { data: session } = useSession();

  const aboutClick = () => {
    setAboutOpen(!isAboutOpen);
    setContactOpen(false);
  }

  const handleCloseOutsideClick = (e) => {
    if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleCloseOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleCloseOutsideClick);
    };
  }, [isMenuOpen]);


  return (
    <>
      <header className={`grid grid-rows-2 small:grid small:grid-cols-3 items-start w-full h-[120px] small:h-20 ${headerClass} pt-3 pb-2 lg:px-10 md:px-4 sm:px-2 ${positionClass} z-10`}>
        <div className='flex pt-2 col-start-1'>
          <Link href={"/"} className={""}>
            <div className={"flex items-center lg:items-start gap-x-4"}>
              <h6 className={"text-2xl lg:text-4xl small:text-3xl font-latto font-bold"}>Kaja</h6>
              <div><img className={"small:h-12 h-8 quick-spin"} src={imgClass} alt={"kaja-logo"}/></div>
            </div>
          </Link>
        </div>
        
        <div className="pt-2 w-full row-start-2 small:row-start-auto col-span-2 small:col-span-1 z-10">
          <SearchBar />
        </div>

        <div className={`flex w-full small:col-start-3 lg:pt-2 lg:pb-2`}>
          <nav ref={menuRef} className={`flex flex-grow flex-col w-auto justify-end items-end lg:items-center lg:flex-row ${isSpecialPage ? 'gap-2' : 'gap-6'} ${navClass}`}>
              <button className=" lg:hidden ml-auto mt-3  " onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <FontAwesomeIcon icon={faBars} />
              </button>
              {/* For large screens */}
              <Link href="/" className="font-mont mb-1 pt-2 lg:inline sm:hidden text-select  " onClick={() => { setAboutOpen(false); setContactOpen(false); }}>Home</Link>
              <div className={`font-mont mb-1 hidden pt-2 lg:inline flex-col ${isSpecialPage ? 'hidden w-0 overflow-hidden' : 'flex'} `}>
                <button onClick={aboutClick} className={`text-select text-center`}>About</button>
                <div className={`${isAboutOpen ? "nav-open" : "nav-closed"} mt-2 absolute backdrop-blur-md text-center transform -translate-x-[50%] z-50 h-[12rem] rounded-lg overflow-scroll no-scrollbar `}>
                  Kaja is a web application in development that aims to simplify planning for trips and outings.
                  With Kaja, users can get a straightforward itinerary based on their interests, budget, and time.
                  Unlike many existing travel apps that offer a wide array of options but leave the hard work of planning to the user, Kaja focuses on streamlining this process to make decision-making easier.
                </div>
              </div>
              <Link href="/Planner" className="font-mont bg-coral px-1 p-2 cursor-pointer rounded-md items-center lg:inline hidden text-off-white text-select">
                Planner
              </Link>
              {/* Login System */}
              {!session ? (
                <button onClick={() => signIn()}  className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUserCircle} /> <span>Login</span>
                </button>
              ) : (
                <button onClick={() => signOut()} className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faSignOutAlt} /> <span>Logout</span>
                </button>
              )}

              

              {/* For small screens */}
              <div className={`lg:hidden flex flex-col justify-end font-mont gap-y-1 text-center ${isMenuOpen ? 'open' : 'closed'} `}>
                  <Link href="/" onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-full bg-coral text-white sm:text-[7px] small:text-base p-2 rounded flex items-center justify-center shadow-sm shadow-black text-select">
                    <FontAwesomeIcon icon={faHome} className="small:mr-2 hidden small:inline" />Home
                  </Link>
                  <Link href="/Planner" className="w-full bg-coral text-white sm:text-[7px] small:text-base p-2 rounded flex  shadow-sm shadow-black text-select">
                    <FontAwesomeIcon icon={faClipboardList} className="small:mr-2 hidden small:inline" /> Planner
                  </Link>
              </div>
            </nav>
        </div>

      </header>
      
    </>
  );
}

export default Header;
