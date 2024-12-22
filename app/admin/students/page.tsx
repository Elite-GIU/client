'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AdminStudentsComponent from '@/app/components/admin/students/AdminStudents';
 // Replace with your admin students component

const StudentsPage = () => {
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
        <AdminStudentsComponent />
      </div>
    );
  }

  router.push('/login'); // Redirect if the role isn't admin
  return null;
};

export default StudentsPage;

