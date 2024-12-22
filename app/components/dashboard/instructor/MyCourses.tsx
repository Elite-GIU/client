import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import CourseCard from '../student/courses/CourseCardInstructor';
import Select from 'react-select';
import {deleteCourse}  from './deleteNotify';

// Assuming you have the predefined keywords stored in `keywordOptions`
const keywordOptions = [
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'Python', label: 'Python' },
  { value: 'React', label: 'React' },
  // Add more predefined keywords as needed
];
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    category: '',
    difficulty_level: 1,
    image_path: '',
    description: '',
    keywords: [] as string[],
  });
  const fetchCourses = async () => {
    try {
      const token = Cookies.get('Token');
      const response = await fetch(`/api/instructor/course`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch courses');

      const jsoned = await response.json();
      const coursesWithInstructorNames = await Promise.all(
        jsoned.map(async (course: Course) => {
            const instructorName = await fetchInstructorName(course.instructor_id);
            return { ...course, instructor_name: instructorName };
        })
    );
      setCourses(coursesWithInstructorNames);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInstructorName = async (instructorId: string): Promise<string | null> => {
    try {
        const token = Cookies.get("Token");
        const response = await fetch(`/api/dashboard/student/get-instructor-name?userId=${instructorId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch instructor name.");
        }

        const data = await response.json();
        return "Instructor: " + data;
    } catch (err) {
        console.error("Error fetching instructor name:", err);
        return "Unknown Instructor";
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
    try {
      const response = await fetch(`/api/instructor/course/${updatedCourse._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        
        body: JSON.stringify(updatedCourse),
      });
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
  
  const createCourse = async () => {
    const token = Cookies.get('Token');
    try {
      const response = await fetch(`/api/instructor/course`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) throw new Error('Failed to create course');

      const createdCourse = await response.json();
      const instructorName = await fetchInstructorName(createdCourse.instructor_id);
      const courseWithInstructorName = { ...createdCourse, instructor_name: instructorName };

      setCourses((prevCourses) => [...prevCourses, courseWithInstructorName]);
      setShowModal(false); // Close the modal
      alert('Course created successfully');
    } catch (error) {
      setError((error as Error).message);
      alert('Error creating course: ' + (error as Error).message);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };
  

  useEffect(() => {
    fetchCourses();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="p-4 space-y-4">
      {/* Extra Card for Adding a New Course */}
      <div
        className="bg-gray-100 rounded-lg p-8 shadow border-dashed border-2 border-gray-300 hover:shadow-lg transition-shadow duration-300 mt-6 cursor-pointer"
        onClick={() => setShowModal(true)} // Open the modal
      >
        <h3 className="font-semibold text-xl text-gray-700 text-center">
          + Add New Course
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
      {courses.length > 0 ? (
        courses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            onUpdate={updateCourse}
            onDelete={() => deleteCourse(course._id, setCourses, setError)} // Passing state functions to deleteCourse
          />
        ))
      ) : (
        <p>No courses available</p>
      )}
      </div>

      {/* Enhanced Modal for Adding a New Course */}
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-gray-800 text-white rounded-xl shadow-lg p-10 w-full max-w-2xl relative animate-fade-in-down">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-100 focus:outline-none"
            onClick={handleModalClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Modal Header */}
          <h3 className="text-2xl font-bold text-center mb-6">Add New Course</h3>

          {/* Input Fields */}
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Title"
              value={newCourse.title || ''}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-400"
            />

            <input
              type="text"
              placeholder="Category"
              value={newCourse.category || ''}
              onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-400"
            />

            <select
              value={newCourse.difficulty_level || ''}
              onChange={(e) =>
                setNewCourse({ ...newCourse, difficulty_level: parseInt(e.target.value) })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-400"
            >
              <option value="" disabled>Select Difficulty Level</option>
              <option value="1">Beginner</option>
              <option value="2">Intermediate</option>
              <option value="3">Advanced</option>
            </select>

            <input
              type="text"
              placeholder="Image Path"
              value={newCourse.image_path || ''}
              onChange={(e) => setNewCourse({ ...newCourse, image_path: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-400"
            />

            <textarea
              placeholder="Description"
              value={newCourse.description || ''}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-400 h-32 resize-none"
            />
            <input
              type="text"
              placeholder="Keywords (comma separated)"
              value={newCourse.keywords.join(', ') || ''}
              onChange={(e) => {
                const keywords = e.target.value.split(',').map((keyword) => keyword.trim());
                setNewCourse({ ...newCourse, keywords });
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-400"
            />

            <Select
              isMulti
              value={newCourse.keywords.map((keyword) => ({
                value: keyword,
                label: keyword,
              }))}
              onChange={(selectedOptions: any) => {
                const selectedKeywords = selectedOptions.map((option: any) => option.value);
                setNewCourse({ ...newCourse, keywords: selectedKeywords });
              }}
              options={keywordOptions}
              className="mt-2 w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center mt-8 space-x-4">
            <button
              className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-600 transition"
              onClick={createCourse}
            >
              Save
            </button>
            <button
              className="bg-gray-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-600 transition"
              onClick={handleModalClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}


    </div>
  );
};


export default CoursePage;
