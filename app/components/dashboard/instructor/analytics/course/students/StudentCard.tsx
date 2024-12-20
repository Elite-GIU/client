import React from 'react';

interface StudentCardProps {
  studentName: string;
  averageGrade: number;
}

const StudentCard: React.FC<StudentCardProps> = ({
  studentName,
  averageGrade,
}) => {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{studentName}</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Average Grade:</span>
          <span className="font-medium text-gray-900">{averageGrade.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;