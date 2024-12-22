'use client';

import * as React from 'react';
import { QuizQuestion } from '@/app/components/dashboard/student/courses/modules/quiz/QuizQuestion';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface QuizResponse {
    quizResponse: {
        user_id: string;
        module_id: string;
        questions: string[];
        answers: string[];
        finalGrade: 'passed' | 'failed';
        _id: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
    questionContent: string[];
    choices: string[][];
}
const Quiz: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    
    console.log('Page Component Params:', params);
    
    const courseId = params.course_id as string;
    const moduleId = params.module_id as string;
    
    console.log('Extracted IDs:', { courseId, moduleId });

    const [questions, setQuestions] = useState<string[]>([]);
    const [allChoices, setAllChoices] = useState<string[][]>([]);
    const [answers, setAnswers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!courseId || !moduleId) {
                setError('Missing required parameters');
                setIsLoading(false);
                return;
            }

            try {
                const token = Cookies.get('Token');
                const response = await fetch(
                    `/api/dashboard/courses/${courseId}/modules/${moduleId}/quiz`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch quiz');
                }

                const data: QuizResponse = await response.json();
                console.log('Quiz Response:', data);
                
                if (data.quizResponse?.questions && Array.isArray(data.quizResponse.questions)) {
                    setQuestions(data.questionContent || []);
                    setAllChoices(data.choices || []);
                    setAnswers(new Array(data.quizResponse.questions.length).fill(''));
                } else {
                    setError('Invalid quiz data format');
                }
            } catch (error) {
                console.error('Error fetching quiz:', error);
                setError('Failed to load quiz');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuiz();
    }, []);

    const handleAnswerSelect = (selectedAnswer: string) => {
        setAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            newAnswers[currentQuestionIndex] = selectedAnswer;
            return newAnswers;
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-semibold">{error}</p>
                    <button 
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!questions.length || !allChoices.length) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-xl font-semibold">No quiz questions available</p>
                    <button 
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-4xl">
                <QuizQuestion
                    questionText={questions[currentQuestionIndex]}
                    answers={allChoices[currentQuestionIndex] || []}
                    currentQuestion={currentQuestionIndex + 1}
                    totalQuestions={questions.length}
                    progress={(currentQuestionIndex + 1) / questions.length * 100}
                    selectedAnswer={answers[currentQuestionIndex]}
                    onAnswerSelect={handleAnswerSelect}
                />
                
                <div className="flex justify-between mt-6">
                    <button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className={`px-4 py-2 rounded ${
                            currentQuestionIndex === 0 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === questions.length - 1}
                        className={`px-4 py-2 rounded ${
                            currentQuestionIndex === questions.length - 1
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Quiz;