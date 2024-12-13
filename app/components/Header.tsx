'use client'
import Link from 'next/link';
import { useState, CSSProperties } from 'react';
import TutorFlowLogo from './TutorFlowLogo';
import SearchBox from './SearchBox';
import Button from './Button'; 

const Header: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({
    height: '0px',
    overflow: 'hidden',
    transition: 'height 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '20px'  
  });

  const toggleDropdown = () => {
    setDropdownStyle({
      ...dropdownStyle,
      height: isDropdownOpen ? '0px' : '150px', 
      overflow: 'hidden',
      transition: 'height 0.2s ease'
    });
    setTimeout(() => {
      setDropdownOpen(!isDropdownOpen);
    }, isDropdownOpen ? 200 : 0);
  };

  return (
    <header className="bg-white shadow-md py-4 px-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-1 flex justify-center md:order-1">
          <Link href="/" className="flex items-center justify-center">
            <TutorFlowLogo size='text-2xl sm:text-4xl md:text-4xl' padding='p-2'/>
          </Link>
        </div>
        <div className="hidden md:flex md:flex-1 justify-center md:order-2">
          <SearchBox />
        </div>
        <div className="hidden md:flex flex-1 justify-center md:order-3">
          <Button label="Login" onClick={() => window.location.href = '/login'} />
        </div>
        <button className="md:hidden absolute right-4 top-4 focus:outline-none" onClick={toggleDropdown} style={{ padding: '8px' }}>
          <svg className={`h-6 w-6 transition-transform duration-300 ${isDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="black" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={isDropdownOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
          </svg>
        </button>
      </div>
      <div className="absolute left-0 w-full bg-white shadow-md z-50" style={dropdownStyle}>
        {isDropdownOpen && (
          <>
            <div style={{ padding: '10px 0' }} />
            <SearchBox />
            <div style={{ padding: '10px 0' }} />
            <Button label="Login" onClick={() => window.location.href = '/login'} />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
