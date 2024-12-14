'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface Course {
  _id: string;
  title: string;
  category: string;
  difficulty_level: number;
  image_path: string;
  ratings: number[];
  instructor_id: string;
  instructor_name?: string;
}

const RecommendedForYou = ({ onEnroll }: { onEnroll: () => void }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstructorName = async (userId: string): Promise<string | null> => {
    const token = Cookies.get('Token');
    try {
      const response = await fetch(`/api/dashboard/student/get-instructor-name?userId=${userId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch instructor name.');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching instructor name:', err);
      return null;
    }
  };

  const fetchCourses = async () => {
    try {
      const token = Cookies.get('Token');
      const response = await fetch('/api/dashboard/student/learning-path', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommended courses.');
      }

      const data: Course[] = await response.json();

      const coursesWithInstructorNames = await Promise.all(
        data.map(async (course) => {
          const instructorName = await fetchInstructorName(course.instructor_id);
          return { ...course, instructor_name: instructorName || 'Unknown Instructor' };
        })
      );

      setCourses(coursesWithInstructorNames);
    } catch (err: unknown) {
      setError((err as Error).message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    const token = Cookies.get('Token');
    try {
      const response = await fetch(`/api/dashboard/student/${courseId}/assign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to enroll in course.');
      }

      // Re-fetch recommended courses
      await fetchCourses();

      // Trigger re-fetch in CurrentCourseProgress via parent
      onEnroll();
    } catch (err) {
      console.error('Error enrolling in course:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (isLoading) {
    return <div className="text-black">Loading...</div>;
  }

  if (error) {
    return <div className="text-black">Error: {error}</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-black">Recommended for You</h2>
      {courses.length === 0 ? ( // Check if courses array is empty
        <div className="text-center text-gray-500 text-sm">
          No recommended courses available at the moment. Check back later!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="border border-gray-200 rounded-lg p-4 shadow-md"
            >
              <img
                src={course.image_path}
                alt={course.title}
                className="w-full h-40 object-cover rounded-md"
              />
              <div className="mt-4">
                <span className="text-xs text-gray-500 bg-gray-100 py-1 px-2 rounded">
                  {`Difficulty: ${course.difficulty_level}`}
                </span>
                <h3 className="text-lg font-medium mt-2 text-black">{course.title}</h3>
                <p className="text-sm text-gray-600 mt-1">Category: {course.category}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Instructor: {course.instructor_name || 'Unknown Instructor'}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <button
                    className="bg-[#3D5A80] text-white px-6 py-2 rounded-full text-sm shadow-md hover:bg-[#2C4E68] transition duration-300"
                    onClick={() => handleEnroll(course._id)}
                  >
                    Enroll
                  </button>
                  <span className="text-sm text-gray-600">
                    Ratings: {course.ratings.length > 0 ? course.ratings.reduce((a, b) => a + b, 0) : 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedForYou;
