'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'

interface Course {
    _id: string;
    title: string;
    category: string;
    difficulty_level: number; 
    image_path: string;
    instructor_id: string;
    instructor_name: string | null;
    description: string;
}

const MyCoursesComponentInstructor =  () => {

    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourses = async() => {

        try {
            
            const token = Cookies.get('Token');
            const response = await fetch(`/api/dashboard/instructor/course`, {
                method: 'GET',
                headers: {Authorization: `Bearer ${token}`}
            });

            if(!response.ok)
                throw new Error('Failed to fetch courses');

            const jsoned = await response.json()

            setCourses(jsoned);

        }catch(error){
            setError((error as Error).message);
        }finally{
            setIsLoading(false);
        }
    }  

    useEffect(() => {
        const effect = async () => {
            await fetchCourses();
        }
        effect();
    }, []);

    if (isLoading) {
        return <div className="text-black">Loading...</div>;
    }
    
    if (error) {
        return <div className="text-black">Error: {error}</div>;
    }

    const getDifficultyBadge = (level: number) => {
        if (level === 1) {
          return (
            <span className="text-xs text-green-700 bg-green-100 py-1 px-2 rounded">
              Easy
            </span>
          );
        } else if (level === 2) {
          return (
            <span className="text-xs text-orange-700 bg-orange-100 py-1 px-2 rounded">
              Intermediate
            </span>
          );
        } else if (level === 3) {
          return (
            <span className="text-xs text-red-700 bg-red-100 py-1 px-2 rounded">
              Hard
            </span>
          );
        }
        return null;
    }

    return (
        <>
        {courses.length === 0 ? (
            <div className="text-center text-gray-500 text-sm">
              No courses found. Start learning by enrolling in a course!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="border border-gray-200 rounded-lg shadow-md"
                >
                  <img
                    src={course.image_path}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    {getDifficultyBadge(course.difficulty_level)}
                    <h3 className="text-lg font-medium mt-2 text-black">
                      {course.title}
                    </h3>
                    {/* Truncate description to two lines */}
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                      {course.description}
                    </p>
                    <div className="mt-4">
                      <a
                        href={`/dashboard/courses/${course._id}`}
                        className="text-blue-600 text-sm font-medium hover:underline"
                      >
                        Course Details
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      );
}

export default MyCoursesComponentInstructor;