// components/UserDropdown.js
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from "next-auth/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import UserSettingsComponent from './UserSettingsComponent.js'; // Import the settings component

const UserDropdown = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {!session ? (
        <>
          <Link href="/auth/signin" className="font-mont border p-3 cursor-pointer rounded hover:bg-gray-400 hover:text-coral transition duration-1000 ease-in-out">
            Log In
          </Link>
          <Link href="/register" className="font-mont bg-coral p-3 cursor-pointer rounded text-off-white hover:bg-dark-coral transition duration-300 ease-in-out ml-3">
            Sign Up
          </Link>
        </>
      ) : (
        <>
          <button onClick={toggleDropdown} className="flex items-center ml-5 cursor-pointer">
            <FontAwesomeIcon icon={faUserCircle} className="text-4xl" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 p-4 w-48 bg-white rounded shadow-xl z-50">
              
              <button onClick={() => signOut()} className="px-4 py-2 w-full text-sm text-left text-gray-700 hover:bg-gray-200">
                Sign Out
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserDropdown;
