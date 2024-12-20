'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CurrentCourseProgress from '../components/dashboard/student/CurrentCourseProgress';
import RecommendedForYou from '../components/dashboard/student/RecommendedForYou';
import Cookies from 'js-cookie';
import GeneralAnalytics from '../components/dashboard/instructor/GeneralAnalytics';

const DashboardPage = () => {
  const [refreshCurrentCourses, setRefreshCurrentCourses] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleCourseEnrolled = () => {
    // Trigger re-fetch in CurrentCourseProgress
    setRefreshCurrentCourses((prev) => !prev);
  };

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
      <section className="mb-12">
        <CurrentCourseProgress refresh={refreshCurrentCourses} />
      </section>
      <section>
        <RecommendedForYou onEnroll={handleCourseEnrolled} />
      </section>
    </div>
  );
  }
  if (role === 'instructor') {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6 text-black">Instructor Dashboard</h1>
        <GeneralAnalytics />
      </div>
    );
  }
};

export default DashboardPage;
