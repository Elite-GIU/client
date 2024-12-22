import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import CourseCard from '../student/courses/CourseCardInstructor';

interface Course {
  _id: string;
  title: string;
  category: string;
  difficulty_level: number;
  image_path: string;
  instructor_id: string;
  instructor_name: string | null;
  description: string;
  keywords: string[];
}

const CoursePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const token = Cookies.get('Token');
      const response = await fetch(`/api/instructor/course`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch courses');

      const jsoned = await response.json();
      setCourses(jsoned);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCourse = async (updatedCourse: {
    _id: string;
    title: string;
    category: string;
    difficulty_level: number;
    image_path: string;
    description: string;
    keywords: string[]; // Adding keywords
  }) => {
    const token = Cookies.get('Token');
    console.log('updatedCourse: '+updatedCourse.description);
    console.log('updatedCourse json : ' + JSON.stringify(updatedCourse));
    try {
      const response = await fetch(`/api/instructor/course/${updatedCourse._id}/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        
        body: JSON.stringify(updatedCourse),
      });
      console.log('response: ' + response);
      if (!response.ok) throw new Error('Failed to update course');
  
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === updatedCourse._id
            ? { ...course, ...updatedCourse }
            : course
        )
      );
    } catch (error) {
      setError((error as Error).message);
      alert('Error updating course: ' + (error as Error).message);
    }
  };
  

  const deleteCourse = async (id: string) => {
    const token = Cookies.get('Token');
    console.log('The Token is :'+token);
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }
    console.log('after the alert');
    try {
      const response = await fetch(`/api/instructor/course/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('the resposnse'+response.text);

      if (!response.ok) {
        const reason = await response.json();
        console.log('the reason '+reason);
        throw new Error(reason.error?.message || 'Failed to delete course');
      }
  
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== id)
      );
  
      alert('Course deleted successfully');
    } catch (error) {
      console.error("Error deleting course:", error);
      setError((error as Error).message);
      alert('Error deleting course: ' + (error as Error).message);
    }
  };
  

  useEffect(() => {
    fetchCourses();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="p-4 space-y-4">
      {/* Extra Card for Adding a New Course */}
      <div className="bg-gray-100 rounded-lg p-8 shadow border-dashed border-2 border-gray-300 hover:shadow-lg transition-shadow duration-300 mt-6 cursor-pointer">
        <h3 className="font-semibold text-xl text-gray-700 text-center">
          + Add New Course
        </h3>
      </div>
      {courses.length > 0 ? (
        courses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            onUpdate={updateCourse}
            onDelete={() => deleteCourse(course._id)}
          />
        ))
      ) : (
        <p>No courses available</p>
      )}
    </div>
  );
} 

export default CoursePage;
