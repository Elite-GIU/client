'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import MyCoursesComponent from '../../components/dashboard/student/MyCourses';
import MyCoursesComponentInstructor from '../../components/dashboard/instructor/MyCourses';
import AdminCoursesComponent from '@/app/components/admin/courses/AdminCourses';

const CoursesPage = () => {
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

  if (role === 'admin') {
    return (
      <div>
        <AdminCoursesComponent />
      </div>
    );
  }

  router.push('/login'); 
  return null;
};

export default CoursesPage;
