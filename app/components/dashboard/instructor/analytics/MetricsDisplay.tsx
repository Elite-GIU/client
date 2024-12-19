'use client';
import * as React from 'react';

export interface CourseMetrics {
    studentCount: number;
    completedCount: number;
    averageGrade: number;
    averageRating: number;
    belowAverage: number,
    average: number,
    aboveAverage: number,
    excellent:number
}

export interface CourseCardProps extends CourseMetrics {
    id: string
    title: string;
    description: string;
}
  
export const MetricsDisplay: React.FC<CourseMetrics> = ({
  studentCount,
  completedCount,
  averageGrade,
  averageRating,
  belowAverage,
  average,
  aboveAverage,
  excellent
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-col">
        <span className="text-sm text-black text-gray-600">Enrolled Students</span>
        <span className="text-lg font-semibold text-black">{studentCount}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-black text-gray-600">Completed</span>
        <span className="text-lg font-semibold text-black">{completedCount}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-black text-gray-600">Avg. Grade</span>
        <span className="text-lg font-semibold text-black">{averageGrade}%</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-black text-gray-600">Rating</span>
        <span className="text-lg font-semibold text-black">{averageRating.toFixed(1)}/5.0</span>
      </div>
      <div className="col-span-2">
      <span className="text-sm text-gray-600">Performance Metrics</span>
        <div className="grid grid-cols-2 gap-2 mt-2">
            <div
            className={`px-3 py-1 rounded-full text-center text-sm font-medium
                bg-red-100 text-red-800`}
            >
            Below Average: {belowAverage}
            </div>
            <div
            className={`px-3 py-1 rounded-full text-center text-sm font-medium
                bg-yellow-100 text-yellow-800`}
            >
            Average: {average}
            </div>
            <div
            className={`px-3 py-1 rounded-full text-center text-sm font-medium
                bg-blue-100 text-blue-800`}
            >
            Above Average: {aboveAverage}
            </div>
            <div
            className={`px-3 py-1 rounded-full text-center text-sm font-medium
                bg-green-100 text-green-800`}
            >
            Excellent: {excellent}
            </div>
        </div>
      </div>
    </div>
  );
};