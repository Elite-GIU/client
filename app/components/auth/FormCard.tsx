import React from 'react';

interface FormCardProps {
  title: string;
  children: React.ReactNode;
}

const FormCard: React.FC<FormCardProps> = ({ title, children }) => {
  return (
    <div className="w-full max-w-[20rem] sm:max-w-[30rem] md:max-w-[32rem] h-auto p-6 sm:p-8 md:p-12 bg-white rounded-[20px] flex flex-col justify-center shadow-[0_10px_50px_rgba(0,0,0,0.15)]">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-4 sm:mb-6" style={{ color: '#3D5A80' }}>
        {title}
      </h2>
      {children}
    </div>
  );
};

export default FormCard;
