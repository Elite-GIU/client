import React from 'react';
import TutorFlowLogo from '../TutorFlowLogo'; 
import Link from 'next/link';

interface DashboardHeaderProps {
  username?: string;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ username, toggleSidebar }) => {
  return (
    <header className="bg-white shadow-md h-16 flex justify-between items-center px-6">
      <button onClick={toggleSidebar} className="sm:hidden">
        <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <Link href="/">
          <TutorFlowLogo  />
      </Link>
      <div className="flex items-center space-x-4">
        {username && (
          <span className="hidden sm:block text-sm text-gray-800">{username}</span>
        )}
        <button aria-label="Notifications" className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2 2 0 0118 14V8a6 6 0 00-12 0v6a2 2 0 01-.595 1.405L4 17h5m4 0v2a2 2 0 01-4 0v-2m4 0H9" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
