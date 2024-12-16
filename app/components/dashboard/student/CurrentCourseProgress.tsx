'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface Course {
  courseId: string;
  courseName: string;
  progress: number;
  averageGrade: number;
  accessedLastMonth: number;
  lastAccessed?: string;
}

const CurrentCourseProgress = ({ refresh }: { refresh: boolean }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    const token = Cookies.get('Token');
    try {
      const response = await fetch('/api/dashboard/student/courses-progress', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch course progress data.');
      }
      const data = await response.json();
      setCourses(data);
    } catch (err: unknown) {
      setError((err as Error).message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [refresh]); // Re-fetch when `refresh` changes

  if (isLoading) {
    return <div className="text-black">Loading...</div>;
  }

  if (error) {
    return <div className="text-black">Error: {error}</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-12 mb-8">
      <h2 className="text-3xl font-semibold mb-6 text-black">Current Course Progress</h2>
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.courseId} className="border border-gray-200 rounded-lg p-6 mx-auto">
          <div className="flex justify-between items-center">
            {/* Course Name on the far left */}
            <h3 className="text-base font-medium text-black">{course.courseName}</h3>
        
            {/* Average Grade and Completion Percentage with proper spacing */}
            <div className="flex items-center justify-end space-x-8">
              <span className="text-black text-sm">Average Grade: {course.averageGrade.toFixed(2)}</span>
              <span className="text-black text-sm">{course.progress.toFixed(2)}% Complete</span>
            </div>
          </div>
        
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-2 rounded-lg mt-4">
            <div
              className="h-2 rounded-lg"
              style={{
                width: `${course.progress}%`,
                backgroundColor: course.progress >= 50 ? '#6a4eff' : '#ff7f7f',
              }}
            ></div>
          </div>
        </div>
        
        ))}
      </div>
    </div>
  );
};

export default CurrentCourseProgress;
