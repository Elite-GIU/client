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
    created_at: string;
}

interface NewQuestion {
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
    const [formError, setFormError] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const courseId = params.course_id;
    const moduleId = params.module_id;
    const questionId = params.question_id;

    // New question form state
    const [newQuestion, setNewQuestion] = useState<NewQuestion>({
        question: '',
        choices: ['', '', '', ''],
        right_choice: '',
        difficulty: 1,
        type: 'mcq'
    });
    const [showForm, setShowForm] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

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

    const handleTypeChange = (type: 'mcq' | 'true_false') => {
        let newChoices = [...newQuestion.choices];
        if (type === 'true_false') {
            newChoices = newChoices.slice(0, 2);
        } else if (type === 'mcq') {
            while (newChoices.length < 4) {
                newChoices.push('');
            }
        }
        setNewQuestion({
            ...newQuestion,
            type,
            choices: newChoices,
            right_choice: ''
        });
    };

    const handleCreate = async () => {
        const token = Cookies.get('Token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch(
                `/api/dashboard/courses/${courseId}/modules/${moduleId}/questionbank`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(newQuestion)
                }
            );

            if (!response.ok) {
                throw new Error('Failed to create question');
            }

            // Reset form and fetch updated questions
            handleCancel();
            fetchQuestions();
        } catch (error) {
            console.error('Error creating question:', error);
        }
    };

    const handleEdit = async () => {
        const token = Cookies.get('Token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch(
                `/api/dashboard/courses/${courseId}/modules/${moduleId}/questionbank/${editingQuestionId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(newQuestion)
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update question');
            }

            // Reset form and fetch updated questions
            handleCancel();
            fetchQuestions();
        } catch (error) {
            console.error('Error updating question:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        // Validate number of choices based on question type
        if (newQuestion.type === 'true_false' && newQuestion.choices.length !== 2) {
            setFormError('True/False questions must have exactly 2 choices');
            return;
        }
        if (newQuestion.type === 'mcq' && newQuestion.choices.length !== 4) {
            setFormError('Multiple Choice questions must have exactly 4 choices');
            return;
        }

        if (editingQuestionId) {
            await handleEdit();
        } else {
            await handleCreate();
        }
    };

    const prepareEdit = (question: Question) => {
        setNewQuestion({
            question: question.question,
            choices: question.choices,
            right_choice: question.right_choice,
            difficulty: question.difficulty,
            type: question.type
        });
        setEditingQuestionId(question._id);
        setShowForm(true);
        setFormError(null);
    };

    const handleCancel = () => {
        setNewQuestion({
            question: '',
            choices: ['', '', '', ''],
            right_choice: '',
            difficulty: 1,
            type: 'mcq'
        });
        setShowForm(false);
        setEditingQuestionId(null);
        setFormError(null);
    };

    const handleDelete = async (questionId: string) => {
        console.log('Deleting question with ID:', questionId);
        if (!window.confirm('Are you sure you want to delete this question?')) {
            return;
        }

        const token = Cookies.get('Token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch(
                `/api/dashboard/courses/${courseId}/modules/${moduleId}/questionbank/${questionId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(`Failed to delete question: ${response.statusText}`);
            }

            // Refresh the questions list
            fetchQuestions();
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const fetchQuestions = async () => {
        const token = Cookies.get('Token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch(
                `/api/dashboard/courses/${courseId}/modules/${moduleId}/questionbank`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            const data = await response.json();
            setQuestions(data.questionbank.questions);
        } catch (error) {
            console.error('Error fetching questions:', error);
            setError('Failed to load questions. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!courseId || !moduleId) return;
        fetchQuestions();
    }, [courseId, moduleId, router]);

    if (isLoading) {
        return <div className="p-6">Loading...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-black">Module Question Bank</h1>
                {role === 'instructor' && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add Question
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-black">
                        {editingQuestionId ? 'Edit Question' : 'Add New Question'}
                    </h2>
                    {formError && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {formError}
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-black mb-2">Question:</label>
                        <input
                            type="text"
                            value={newQuestion.question}
                            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                            className="w-full p-2 border rounded text-black"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2">Type:</label>
                        <select
                            value={newQuestion.type}
                            onChange={(e) => handleTypeChange(e.target.value as 'mcq' | 'true_false')}
                            className="w-full p-2 border rounded text-black"
                            required
                        >
                            <option value="true_false">True/False</option>
                            <option value="mcq">Multiple Choice</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2">Choices:</label>
                        {newQuestion.choices.map((choice, index) => (
                            <div key={index} className="flex mb-2">
                                <input
                                    type="text"
                                    value={choice}
                                    onChange={(e) => {
                                        const newChoices = [...newQuestion.choices];
                                        newChoices[index] = e.target.value;
                                        setNewQuestion({ ...newQuestion, choices: newChoices });
                                    }}
                                    className="flex-1 p-2 border rounded mr-2 text-black"
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2">Correct Answer:</label>
                        <select
                            value={newQuestion.right_choice}
                            onChange={(e) => setNewQuestion({ ...newQuestion, right_choice: e.target.value })}
                            className="w-full p-2 border rounded text-black"
                            required
                        >
                            <option value="">Select correct answer</option>
                            {newQuestion.choices.map((choice, index) => (
                                choice && <option key={index} value={choice}>{choice}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2">Difficulty (1-3):</label>
                        <input
                            type="number"
                            min="1"
                            max="3"
                            value={newQuestion.difficulty}
                            onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: parseInt(e.target.value) })}
                            className="w-full p-2 border rounded text-black"
                            required
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {editingQuestionId ? 'Update Question' : 'Create Question'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-6">
                {questions.map((question) => (
                    <div key={question._id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div className="font-semibold text-black">{question.question}</div>
                            {role === 'instructor' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => prepareEdit(question)}
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(question._id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            {question.choices.map((choice, choiceIndex) => (
                                <div
                                    key={choiceIndex}
                                    className={`p-2 rounded text-black ${
                                        choice === question.right_choice
                                            ? 'bg-green-100 border border-green-300'
                                            : 'bg-gray-50'
                                    }`}
                                >
                                    {choice}
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 text-sm text-black">
                            <span className="mr-4">Type: {question.type}</span>
                            <span>Difficulty: {question.difficulty}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}