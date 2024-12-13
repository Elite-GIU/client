import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean; 
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}  
      className={`w-40 py-2 text-sm bg-[#3D5A80] text-white rounded-full hover:bg-opacity-90 transition-all duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'  
      }`}
    >
      {label}
    </button>
  );
};

export default Button;
