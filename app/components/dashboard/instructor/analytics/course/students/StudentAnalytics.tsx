'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import StudentCard from './StudentCard';
import { Params } from 'next/dist/server/request/params';
import Pagination from '@/app/components/Pagination';

interface StudentAnalytics {
  studentId: string;
  studentName: string;
  averageGrade: number;
  bestGrade: number;
  lowestGrade: number;
  averageRating: number;
}

interface Props {
  courseId: string;
}

const StudentAnalyticsComponent: React.FC<Props> = ({ courseId }) => {
  const [students, setStudents] = useState<StudentAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [searchName, setSearchName] = useState(''); 
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      const token = Cookies.get('Token');
      const response = await fetch(`/api/dashboard/instructor/analytics/courses/${courseId}/students?page=${currentPage}&name=${searchName}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students.');
      }

      const data = await response.json();
      setStudents(data.students);
      setCurrentPage(data.currentPage)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError((err as Error).message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [courseId, currentPage, searchName]);

  if (isLoading) {
    return <div className="text-black">Loading...</div>;
  }

  if (error) {
    return <div className="text-black">Error: {error}</div>;
  }

  
  const handleNextPage = () => {
    if (Number(currentPage) < totalPages) {
      setCurrentPage(Number(currentPage) + 1);
    }
  };

  const handlePreviousPage = () => {
    if (Number(currentPage) > 1) {
        setCurrentPage(Number(currentPage) - 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(Number(page)); 
  };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
    setCurrentPage(1); 
    };


  return (
    <div className="bg-white shadow-lg rounded-lg p-12 mb-8">
      <h1 className="text-3xl font-semibold mb-6 text-black">My Students Analytics</h1>
      <div>
      <input
          type="text"
          value={searchName}
          onChange={handleSearch}
          placeholder="Search by student name"
          className="p-2 border rounded mb-4"
        />
      </div>
      <div className="space-y-4">
        {students.map((student, index) => (
          <div key={student.studentId || index}>
            <StudentCard
              studentName={student.studentName}
              averageGrade={student.averageGrade}
            />
          </div>
        ))}
      </div>
      <Pagination
            currentPage={Number(currentPage)}
            totalPages={Number(totalPages)}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
            onPageClick={handlePageClick}
        />
    </div>
  );
};

export default StudentAnalyticsComponent;
