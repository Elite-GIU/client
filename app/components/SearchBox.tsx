import React, { useState, useEffect } from 'react';

const SearchBox: React.FC = () => {
  const [inputStyle, setInputStyle] = useState({
    minWidth: '400px'
  });
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 700) { 
        setInputStyle({
          minWidth: '300px'
        });
      } else {
        setInputStyle({
          minWidth: '400px' 
        });
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex items-center rounded-full bg-gray-100 overflow-hidden shadow-sm">
      <input
        type="text"
        placeholder="Search Courses..."
        className="px-6 py-2 w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-500"
        style={inputStyle}
      />
      <button className="p-2 text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  );
};

export default SearchBox;
