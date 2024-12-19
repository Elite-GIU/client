'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { CourseCard } from './CourseCard';
import Loading from '@/app/loading';

interface PerformanceMetrics {
    belowAverage: number,
    average: number,
    aboveAverage: number,
    excellent: number,
}
interface CourseAnalytics {
    courseId: string,
    courseName: string,
    description: string, 
    studentCount: number,
    studentsCompletedCourse: number,
    performanceMetrics: PerformanceMetrics
    averageGrade: number,
    averageRatings: number
}

const CourseAnalyticsComponent = () => {
  const [courses, setCourses] = useState<CourseAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch quizzes
  const fetchCourses = async () => {
    try {
      const token = Cookies.get('Token');
      const response = await fetch('/api/dashboard/instructor/analytics/courses', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses.');
      }

      const data: CourseAnalytics[] = await response.json();

      setCourses(data);
    } catch (err) {
      setError((err as Error).message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchCourses();
  }, []);


  if (isLoading) {
    return <div className="text-black">Loading...</div>;
  }

  if (error) {
    return <div className="text-black">Error: {error}</div>;
  }

  
  return (
    <div className="bg-white shadow-lg rounded-lg p-12 mb-8">
      <h1 className="text-3xl font-semibold mb-6 text-black">My Course Analytics</h1>
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={course.courseId || index}>
            <CourseCard
              id ={course.courseId}
              title={course.courseName}
              description={course.description}
              studentCount={course.studentCount}
              completedCount={course.studentsCompletedCourse}
              averageGrade={course.averageGrade}
              averageRating={course.averageRatings}
              belowAverage = {course.performanceMetrics.belowAverage}
              average = {course.performanceMetrics.average}
              aboveAverage = {course.performanceMetrics.aboveAverage}
              excellent = {course.performanceMetrics.excellent}

            />
          </div>
        ))}
      </div>
    </div>
  );
};  

export default CourseAnalyticsComponent;