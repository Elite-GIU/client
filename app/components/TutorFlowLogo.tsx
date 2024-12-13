import React from 'react';

interface TutorFlowLogoProps {
  size?: string; 
  padding?: string;
}

const TutorFlowLogo: React.FC<TutorFlowLogoProps> = ({
  size = 'text-3xl sm:text-4xl md:text-5xl',
  padding = 'p-4',
}) => {
  return (
    <div className={`flex items-center ${size} ${padding} space-x-1`}>
      <span className="font-bold" style={{ color: '#98C1D9' }}>
        tutor
      </span>
      <span className="font-bold" style={{ color: '#3D5A80' }}>
        Flow
      </span>
    </div>
  );
};

export default TutorFlowLogo;
