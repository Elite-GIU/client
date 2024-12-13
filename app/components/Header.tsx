'use client'
import Link from 'next/link';
import { useState, useEffect, CSSProperties } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import TutorFlowLogo from './TutorFlowLogo';
import SearchBox from './SearchBox';
import Button from './Button'; 
import Loading from '../loading';

const Header: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({
    height: '0px',
    overflow: 'hidden',
    transition: 'height 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0px'  // Adjusted padding to reduce elongation
  });
  const [userName, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const toggleDropdown = () => {
    setDropdownStyle({
      ...dropdownStyle,
      height: isDropdownOpen ? '0px' : '120px', // Reduced the height for less elongation
      overflow: 'hidden',
      transition: 'height 0.2s ease'
    });
    setTimeout(() => {
      setDropdownOpen(!isDropdownOpen);
    }, isDropdownOpen ? 200 : 0);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!isUserMenuOpen);
  };

  useEffect(() => {
    const token = Cookies.get('Token');
    if (token) {
      
      axios.get('/api/profile/name', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.status === 200) {
          setUserName(response.data); 
        }
        setIsLoading(false); 
      })
      .catch(error => {
        console.error('Error fetching user name:', error);
        setIsLoading(false); 
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('Token');
    window.location.href = '/';
  }
  if (isLoading) {
    return <Loading />;
  }

  return (
    <header className="bg-white shadow-md py-2 px-4 relative"> 
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-1 flex justify-center md:order-1">
          <Link href="/" className="flex items-center justify-center">
            <TutorFlowLogo size='text-2xl sm:text-3xl md:text-4xl' padding='p-2'/>
          </Link>
        </div>
        <div className="hidden md:flex md:flex-1 justify-center md:order-2">
          <SearchBox />
        </div>
        <div className="hidden md:flex flex-1 justify-center md:order-3 relative">
          {userName ? (
            <>
              <div onClick={toggleUserMenu} className="text-black font-semibold cursor-pointer">
                Hello, {userName}
                <svg className="ml-2 w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-1 py-2 w-48 bg-white border rounded shadow-xl">
                  <Link href="/dashboard" legacyBehavior>
                    <a className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Dashboard</a>
                  </Link>
                  <a onClick={handleLogout} className="block px-4 py-2 text-red-600 hover:bg-gray-200 flex items-center" >
                    <svg className="mr-2 w-4 h-4" fill="none" stroke="red" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-14V3m0 14v1m0-16H6a2 2 0 00-2 2v14a2 2 0 002 2h6"></path>
                    </svg>
                    Logout
                  </a>
                </div>
              )}
            </>
          ) : (
            <Button label="Login" onClick={() => window.location.href = '/login'} />
          )}
        </div>
        <button className="md:hidden absolute right-4 top-4 focus:outline-none" onClick={toggleDropdown} style={{ padding: '8px' }}>
          <svg className={`h-6 w-6 transition-transform duration-300 ${isDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="black" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={isDropdownOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
          </svg>
        </button>
      </div>
      <div style={dropdownStyle}>
        {isDropdownOpen && (
          <>
            <div style={{ padding: '10px 0' }} />
            <SearchBox />
            <div style={{ padding: '10px 0' }} />
            {userName ? (
            <>
              <div onClick={toggleUserMenu} className="text-black font-semibold cursor-pointer">
                Hello, {userName}
                <svg className="ml-2 w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-1 py-2 w-48 bg-white border rounded shadow-xl">
                  <Link href="/dashboard" legacyBehavior>
                    <a className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Dashboard</a>
                  </Link>
                  <a onClick={handleLogout} className="block px-4 py-2 text-red-600 hover:bg-gray-200 flex items-center" >
                    <svg className="mr-2 w-4 h-4" fill="none" stroke="red" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-14V3m0 14v1m0-16H6a2 2 0 00-2 2v14a2 2 0 002 2h6"></path>
                    </svg>
                    Logout
                  </a>
                </div>
              )}
            </>
          ) : (
            <Button label="Login" onClick={() => window.location.href = '/login'} />
          )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
