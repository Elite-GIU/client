'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface QuestionFeedback {
    question: string;
    yourAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
}

interface QuizFeedback {
    score: number;
    feedback: QuestionFeedback[];
    message: string;
}

const QuizFeedback = () => {
    const params = useParams();
    const router = useRouter();
    const quizId = params.quiz_id;
    const [feedback, setFeedback] = useState<QuizFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const token = Cookies.get('Token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const response = await fetch(`/api/dashboard/courses/${params.course_id}/modules/${params.module_id}/quiz/${quizId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch quiz feedback');
                }

                const data = await response.json();
                setFeedback(data);
            } catch (error) {
                console.error('Error fetching quiz feedback:', error);
                setError('Failed to load quiz feedback');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedback();
    }, [quizId]);

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

    if (!feedback) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Results</h1>
                    <div className="text-lg text-gray-600 mb-4">Score: {feedback.score}%</div>
                    <div className={`text-lg font-medium mb-6 ${
                        feedback.score >= 50 ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {feedback.message}
                    </div>
                </div>

                <div className="space-y-4">
                    {feedback.feedback.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                    item.isCorrect ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                    {item.isCorrect ? (
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Question {index + 1}</h3>
                            </div>
                            <p className="text-gray-700 mb-4">{item.question}</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Your Answer:</p>
                                    <p className={`font-medium ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.yourAnswer}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Correct Answer:</p>
                                    <p className="font-medium text-green-600">{item.correctAnswer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Quizzes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizFeedback;