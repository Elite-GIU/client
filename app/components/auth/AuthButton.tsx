import React from 'react';

interface AuthButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean; 
}

const AuthButton: React.FC<AuthButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}  
      className={`w-72 py-2 text-sm bg-[#3D5A80] text-white rounded-md hover:bg-opacity-90 transition-all duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'  
      }`}
    >
      {label}
    </button>
  );
};

export default AuthButton;
