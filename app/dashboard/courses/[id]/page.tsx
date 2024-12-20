'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InstructorCourse from '../../../components/dashboard/instructor/InstructorCourse'
import Cookies from 'js-cookie';
import { Params } from 'next/dist/server/request/params';

const CoursePage =  (context : { params: Promise<Params>}) => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courseId, setCourseId] = useState<any>("");
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

  useEffect(() => {
    async function awaitParams() {
        const {id} = await context.params;
        setCourseId(id); 
    }
    awaitParams();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state
  }

  if (role === 'student') {
    return (
      <h1>
        Unauthorized
      </h1>
    );
  }

  if (role === 'instructor') {
    return (
      <div>
        {courseId ? 
        <InstructorCourse id = {courseId}/> :
        'loading'
        }
      </div>
    );
  }

  return null; // Fallback if the role is undefined or not matched
};

export default CoursePage;