'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Loading from '@/app/loading';

const GeneralAnalytics = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      const token = Cookies.get('Token');
      const response = await fetch('/api/dashboard/instructor/analytics', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses.');
      }

      const data = await response.json();

      setMetrics(data);
    } catch (err) {
      setError((err as Error).message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

   useEffect(() => {
      fetchAnalytics();
    }, []);

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
    
      if (isLoading) {
        return (
          <div className="flex justify-center items-center h-full">
            <p className="text-black text-lg font-semibold">Loading analytics...</p>
          </div>
        );
      }
    
      if (!metrics) {
        return (
          <div className="flex justify-center items-center h-full">
            <p className="text-black text-lg font-semibold">No analytics data available.</p>
          </div>
        );
      }
    
      const { highestRatedCourse, studentWithHighestGrade, courseWithHighestAverageGrade, courseWithMostStudents } = metrics;
    
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-lg shadow-md">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-black mb-4">📚 Highest Rated Course</h2>
            <p className="text-black text-lg">Course: <span className="font-medium">{highestRatedCourse?.title || 'N/A'}</span></p>
            <div className="flex items-center space-x-2">
              <p className="text-black text-lg">Rating:</p>
              {highestRatedCourse?.averageRating ? (
                <>
                  {renderStars(highestRatedCourse.averageRating)}
                  <span className="text-black text-sm ml-2">({highestRatedCourse.averageRating.toFixed(1)} / 5)</span>
                </>
              ) : (
                <span className="text-black text-lg">N/A</span>
              )}
            </div>
          </div>
    
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-black mb-4">👩‍🎓 Student With Highest Grade</h2>
            <p className="text-black text-lg">Student: <span className="font-medium">{studentWithHighestGrade?.studentName || 'N/A'}</span></p>
            <p className="text-black text-lg">Grade: <span className="font-medium">{studentWithHighestGrade?.grade || 'N/A'}</span></p>
            <p className="text-black text-lg">Course: <span className="font-medium">{studentWithHighestGrade?.courseName || 'N/A'}</span></p>
          </div>
    
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-black mb-4">🏆 Course With Highest Average Grade</h2>
            <p className="text-black text-lg">Course: <span className="font-medium">{courseWithHighestAverageGrade?.title || 'N/A'}</span></p>
            <p className="text-black text-lg">Average Grade: <span className="font-medium">{courseWithHighestAverageGrade?.averageGrade || 'N/A'}</span></p>
          </div>
    
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-black mb-4">👨‍🏫 Course With Most Students</h2>
            <p className="text-black text-lg">Course: <span className="font-medium">{courseWithMostStudents?.title || 'N/A'}</span></p>
            <p className="text-black text-lg">Students: <span className="font-medium">{courseWithMostStudents?.studentCount || 'N/A'}</span></p>
          </div>
        </div>
      );
};

export default GeneralAnalytics;
