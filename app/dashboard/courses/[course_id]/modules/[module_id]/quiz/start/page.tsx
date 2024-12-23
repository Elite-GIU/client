'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { QuizProgress } from '@/app/components/dashboard/student/quizzes/QuizProgress';
import { QuizCard } from '@/app/components/dashboard/student/quizzes/QuizCard';
import Cookies from 'js-cookie';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: string;
  isVisible: boolean;
  content: string;
  upload_date: Date;
  last_updated: Date;
}

interface ModuleQuizDetails {
  ratings: number[];
  _id: string;
  courseId: string;
  title: string;
  content: ContentItem[];
  assessmentType: 'mcq' | 'true_false';
  numberOfQuestions: number;
  passingGrade: number;
  createdAt: string;
}

interface QuizDetails {
  quizId: string;
  courseName: string;
  moduleName: string;
  grade?: number;
  finalGrade?: string;
}

const StartQuiz = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.course_id;
  const moduleId = params.module_id;
  const quizId = params.quiz_id;
  const [quizDetails, setQuizDetails] = useState<QuizDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [moduleDetails, setModuleDetails] = useState<ModuleQuizDetails | null>(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const token = Cookies.get('Token');
        const response = await fetch(`/api/dashboard/student/quizzes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quiz details');
        }

        const data = await response.json();
        setQuizDetails(data);
      } catch (error) {
        console.error('Error fetching quiz details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchModuleDetails = async () => {
      try {
        const token = Cookies.get('Token');
        const response = await fetch(`/api/dashboard/courses/${courseId}/modules/${moduleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch module details');
        }

        const data = await response.json();
        setModuleDetails(data);
      } catch (error) {
        console.error('Error fetching module details:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchModuleDetails();
    fetchQuizDetails();
  }, [quizId]);

  const handleStartQuiz = () => {
    router.push(`/dashboard/courses/${courseId}/modules/${moduleId}/quiz`);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        {quizDetails && (
          <div className="mb-8">
            <QuizProgress
              quizId={quizDetails.quizId}
              courseName={quizDetails.courseName}
              moduleName={quizDetails.moduleName}
              grade={quizDetails.grade || 0}
              finalGrade={quizDetails.finalGrade || ''}
            />
          </div>
        )}

        <div className="flex flex-col font-bold leading-tight">
          {moduleDetails && (
            <div className="flex flex-col items-center px-16 pt-12 w-full bg-neutral-100 pb-[911px] max-md:px-5 max-md:pb-24 max-md:max-w-full">
              <QuizCard
                title={moduleDetails.title}
                questionCount={moduleDetails.numberOfQuestions}
                quizType={moduleDetails.assessmentType === 'mcq' ? 'Multiple Choice' : (moduleDetails.assessmentType === 'true_false' ? 'True/False' : 'Mix')}
                onStart={handleStartQuiz}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartQuiz;
