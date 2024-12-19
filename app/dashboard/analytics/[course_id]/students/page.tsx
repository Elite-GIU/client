'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import StudentAnalyticsComponent from '@/app/components/dashboard/instructor/analytics/course/students/StudentAnalytics';


const StudentAnalyticsPage = () => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { course_id  } = useParams();

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
  const courseId = typeof course_id === 'string' ? course_id : '';

  if (role === 'instructor') {
    return (
      <div>
        <StudentAnalyticsComponent courseId={courseId} />
      </div>
    );
  }

  return null; 
};

export default StudentAnalyticsPage;