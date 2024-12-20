'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StudentCourse from '../../../components/dashboard/student/StudentCourse';
import Cookies from 'js-cookie';
import { use } from 'react';

type CoursePageProps = {
  params: Promise<{ course_id: string }>;
};

const CoursePage = ({ params }: CoursePageProps) => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courseId, setCourseId] = useState<string | null>(null);
  const router = useRouter();

  const { course_id } = use(params); // Unwrap `params` to get `course_id`

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
    if (course_id) {
      setCourseId(course_id);
    }
  }, [course_id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (role === 'student') {
    return (
      <div>
        {courseId ? <StudentCourse id={courseId} /> : 'Loading course information...'}
      </div>
    );
  }

  return null;
};

export default CoursePage;
