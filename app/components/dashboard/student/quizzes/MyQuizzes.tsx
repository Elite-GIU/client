'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { QuizProgress } from './QuizProgress';

interface Quiz {
  quizId: string;
  courseName: string;
  moduleName: string;
  grade: number; 
}

const MyQuizzesComponent = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch quizzes
  const fetchQuizzes = async () => {
    try {
      const token = Cookies.get('Token');
      const response = await fetch('/api/dashboard/student/quizzes', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses.');
      }

      const data: Quiz[] = await response.json();

      setQuizzes(data);
    } catch (err) {
      setError((err as Error).message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
    console.log(quizzes);
  }, []);


  if (isLoading) {
    return <div className="text-black">Loading...</div>;
  }

  if (error) {
    return <div className="text-black">Error: {error}</div>;
  }

  
  return (
    <div className="bg-white shadow-lg rounded-lg p-12 mb-8">
      <h2 className="text-3xl font-semibold mb-6 text-black">Quizzes Progress</h2>
      <div className="space-y-4">
        {quizzes.map((quiz, index) => (
          <div key={quiz.quizId || index} className="border border-gray-200 rounded-lg p-6 mx-auto">
            <QuizProgress
              quizId = {quiz.quizId}
              moduleName={quiz.moduleName}
              courseName={quiz.courseName}
              grade={quiz.grade}
            />
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default MyQuizzesComponent;