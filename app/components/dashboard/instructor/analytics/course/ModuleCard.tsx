import React from 'react';

interface ModuleCardProps {
  moduleName: string;
  averageGrade: number;
  bestGrade: number;
  lowestGrade: number;
  averageRating: number;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  moduleName,
  averageGrade,
  bestGrade,
  lowestGrade,
  averageRating,
}) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <span key={`full-${index}`} className="text-yellow-400 text-lg">★</span>
          ))}
        {halfStar && <span className="text-yellow-400 text-lg">☆</span>}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <span key={`empty-${index}`} className="text-gray-300 text-lg">★</span>
          ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{moduleName}</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Average Grade:</span>
          <span className="font-medium text-gray-900">{averageGrade.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Best Grade:</span>
          <span className="font-medium text-gray-900">{bestGrade}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Lowest Grade:</span>
          <span className="font-medium text-gray-900">{lowestGrade}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Average Rating:</span>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">{averageRating.toFixed(1)}/5</span>
            {renderStars(averageRating)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
