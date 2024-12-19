import React from 'react';
import { ChevronDown } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-[320px] border-r">
      <nav className="p-6 space-y-4">
        {/* Modules Section */}
        <div className="flex items-center justify-between p-4 bg-[#D9D9D9] text-white rounded-md">
          <span className="text-2xl font-medium text-black">Modules</span>
          <ChevronDown className="w-8 h-8 text-black" />
        </div>
        
        {/* Threads Section */}
        <div className="flex items-center justify-between p-4 bg-[#DFF3FF] text-white relative rounded-md">
          <span className="text-2xl font-medium text-black">Threads</span>
          <div className="w-3 h-[68px] bg-[#3b82f6] absolute right-0 rounded-r-md" />
        </div>
        
        {/* Rooms Section */}
        <div className="flex items-center justify-between p-4 bg-[#D9D9D9] text-white rounded-md">
          <span className="text-2xl font-medium text-black">Rooms</span>
        </div>
      </nav>
    </aside>
  );
}
