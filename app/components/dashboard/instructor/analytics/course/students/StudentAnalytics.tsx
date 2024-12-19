'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import StudentCard from './StudentCard';


interface StudentAnalytics {
    studentId: string
    studentName: string
    averageGrade: number
    bestGrade: number
    lowestGrade: number
    averageRating: number
}

const StudentAnalyticsComponent : React.FC<{ courseId: string }>= ({courseId}) => {
  const [students, setStudents] = useState<StudentAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch quizzes
  const fetchStudents = async () => {
    try {
      const token = Cookies.get('Token');
      const response = await fetch(`/api/dashboard/instructor/analytics/courses/${courseId}/students`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses.');
      }

      const data: StudentAnalytics[] = await response.json();

      setStudents(data);
    } catch (err) {
      setError((err as Error).message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchStudents();
  }, []);


  if (isLoading) {
    return <div className="text-black">Loading...</div>;
  }

  if (error) {
    return <div className="text-black">Error: {error}</div>;
  }

  
  return (
    <div className="bg-white shadow-lg rounded-lg p-12 mb-8">
      <h1 className="text-3xl font-semibold mb-6 text-black">My Student Analytics</h1>
      <div className="space-y-4">
        {students.map((student, index) => (
          <div key={student.studentId || index}>
            <StudentCard
              studentName={student.studentName}
              averageGrade={student.averageGrade}
            />
          </div>
        ))}
      </div>
    </div>
  );
};  

export default StudentAnalyticsComponent;