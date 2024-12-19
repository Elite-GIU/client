'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import CourseAnalyticsComponent from '@/app/components/dashboard/instructor/analytics/CourseAnalytics';

const AnalyticsPage = () => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

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

  const handleDownloadAnalytics = async () => {
    const token = Cookies.get('Token');
    if (!token) {
      setDownloadStatus('Error: No authentication token found');
      return;
    }

    try {
      setDownloadStatus('Downloading...');

      const response = await fetch('/api/dashboard/instructor/analytics/courses/download', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'InstructorReport.xlsx'; 
      link.click(); 

      setDownloadStatus('Download successful!');
      
    } catch (error) {
      console.error('Error downloading analytics:', error);
      setDownloadStatus('Error: Failed to download file');
    }
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (role === 'instructor') {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <button
            onClick={handleDownloadAnalytics}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Download Analytics
          </button>
        </div>
        <CourseAnalyticsComponent />
      </div>
    );
  }

  return null; 
};

export default AnalyticsPage;