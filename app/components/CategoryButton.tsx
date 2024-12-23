import * as React from 'react';

export interface CategoryButtonProps {
    label: string;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({ label }) => {
  return (
    <div className="text-center self-stretch text-white rounded-xl shadow-lg px-4 py-2"
         style={{
           backgroundColor: '#3D5A80',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           height: '43px',
           width: '195px'  // Setting a fixed width
         }}>
      {label}
    </div>
  );
};
