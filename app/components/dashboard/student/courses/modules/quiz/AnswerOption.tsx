import React from 'react';

interface AnswerOptionProps {
  text: string;
  isSelected: boolean;
  onClick: () => void;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  text,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 text-left rounded-lg transition-all duration-200 ${
        isSelected
          ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
          : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center">
        <div
          className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
            isSelected ? 'border-blue-500' : 'border-gray-400'
          }`}
        >
          {isSelected && (
            <div className="w-3 h-3 rounded-full bg-blue-500" />
          )}
        </div>
        <span className="text-base font-medium">{text}</span>
      </div>
    </button>
  );
};