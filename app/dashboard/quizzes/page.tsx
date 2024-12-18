'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import MyQuizzesComponent from '@/app/components/dashboard/student/quizzes/MyQuizzes';

const QuizzesPage = () => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (role === 'student') {
    return (
      <div>
        <MyQuizzesComponent />
      </div>
    );
  }

  if (role === 'instructor') {
    return (
      <div>
        <h1 className="text-3xl font-semibold mb-6">Instructor Dashboard</h1>
        <div>TODO: Implement instructor courses functionality</div>
      </div>
    );
  }

  return null; 
};

export default QuizzesPage;
