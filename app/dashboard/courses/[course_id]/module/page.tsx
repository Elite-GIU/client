'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface Question {
    _id: string;
    question: string;
    choices: string[];
    right_choice: string;
    difficulty: number;
    type: 'mcq' | 'true_false';
}

export default function ModulePage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [role, setRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const courseId = params.course_id;
    const moduleId = params.module_id;

    useEffect(() => {
        const fetchRole = async () => {
          const token = Cookies.get('Token');
          if (!token) {
            router.push('/login');
            return;
          }
    
          try {
            const response = await fetch('/api/profile/role', {
              method: 'GET',
              headers: { Authorization: `Bearer ${token}` },
            });
    
            if (response.ok) {
              const data = await response.json();
              setRole(data.role);
            } else {
              router.push('/login');
            }
          } catch (error) {
            console.error('Error fetching role:', error);
            router.push('/login');
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchRole();
      }, [router]);

    useEffect(() => {
        if (!courseId || !moduleId) return;

        const fetchQuestions = async () => {
            const token = Cookies.get('Token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch(
                    `/api/dashboard/courses?course_id=${courseId}/module?module_id=${moduleId}/questionbank`,
                    {
                        method: 'GET',
                        headers: { 
                            Authorization: `Bearer ${token}` 
                        },
                    }
                );

                if (!response.ok) throw new Error(`Error: ${response.statusText}`);
                const { data } = await response.json();
                setQuestions(data);
            } catch (error) {
                console.error('Error fetching questions:', error);
                setError('Failed to load questions. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
    }, [courseId, moduleId, router]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Module Question Bank</h1>
            <div className="space-y-6">
                {questions.map((question, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow">
                        <div className="font-semibold mb-2">{question.question}</div>
                        <div className="space-y-2">
                            {question.choices.map((choice, choiceIndex) => (
                                <div
                                    key={choiceIndex}
                                    className={`p-2 rounded ${
                                        choice === question.right_choice
                                            ? 'bg-green-100 border border-green-300'
                                            : 'bg-gray-50'
                                    }`}
                                >
                                    {choice}
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            <span className="mr-4">Type: {question.type}</span>
                            <span>Difficulty: {question.difficulty}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}