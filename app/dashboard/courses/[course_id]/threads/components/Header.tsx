import React from 'react';
import { Bell } from 'lucide-react';
import TutorFlowLogo from '@/app/components/TutorFlowLogo';

export function Header() {
  return (
    <header className="flex justify-between items-center px-10 py-4">
      <TutorFlowLogo />
      <div className="flex items-center gap-4">
        <Bell className="w-12 h-12 text-[#1D1B20]" />
      </div>
    </header>
  );
}