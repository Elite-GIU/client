import React, { JSX } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
  items: { name: string; icon: JSX.Element; href: string }[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ items, isOpen, setIsOpen}) => {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (href: string) => {
    router.push(href); 
    setIsOpen(false);  
  };

  const isSelected = (href: string) => pathname === href;

  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 fixed h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out`}>
      <ul className="p-0 m-0">
        {items.map((item, index) => (
          <li key={index}
              style={{
                backgroundColor: isSelected(item.href) ? '#DFF3FF' : undefined,
                position: 'relative',
                padding: '10px'
              }}
              className={`flex items-center cursor-pointer hover:bg-gray-100 w-full`}
              onClick={() => navigate(item.href)}>
            {React.cloneElement(item.icon, { color: isSelected(item.href) ? '#3D5A80' : 'black', size: '1.5em' })}
            <span className="ml-4 text-black flex-1">{item.name}</span>
            {isSelected(item.href) && <div style={{
                width: '4px',
                height: '100%',
                backgroundColor: '#3D5A80',
                position: 'absolute',
                right: 0
              }}></div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardSidebar;
