'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import ModuleCard from './ModuleCard';


interface ModuleAnalytics {
    moduleId: string
    moduleName: string
    averageGrade: number
    bestGrade: number
    lowestGrade: number
    averageRating: number
}

const ModuleAnalyticsComponent : React.FC<{ courseId: string }>= ({courseId}) => {
  const [modules, setModules] = useState<ModuleAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch quizzes
  const fetchModules = async () => {
    try {
      const token = Cookies.get('Token');
      const response = await fetch(`/api/dashboard/instructor/analytics/courses/${courseId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses.');
      }

      const data: ModuleAnalytics[] = await response.json();

      setModules(data);
    } catch (err) {
      setError((err as Error).message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchModules();
  }, []);


  if (isLoading) {
    return <div className="text-black">Loading...</div>;
  }

  if (error) {
    return <div className="text-black">Error: {error}</div>;
  }

  
  return (
    <div className="bg-white shadow-lg rounded-lg p-12 mb-8">
      <h1 className="text-3xl font-semibold mb-6 text-black">My Module Analytics</h1>
      <div className="space-y-4">
        {modules.map((module, index) => (
          <div key={module.moduleId || index}>
            <ModuleCard
              moduleName={module.moduleName}
              bestGrade={module.bestGrade}
              averageGrade={module.averageGrade}
              lowestGrade={module.lowestGrade}
              averageRating={module.averageRating}
            />
          </div>
        ))}
      </div>
    </div>
  );
};  

export default ModuleAnalyticsComponent;