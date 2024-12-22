
import * as React from 'react';

export interface CategoryButtonProps {
    label: string;
  }

export const CategoryButton: React.FC<CategoryButtonProps> = ({ label }) => {
  return (
<div className="text-center gap-2 self-stretch px-2 py-3.5 whitespace-nowrap rounded-xl bg-blue-100 h-[43px] min-h-[43px] w-[195px] shadow-lg">
  {label}
</div>


  );
};