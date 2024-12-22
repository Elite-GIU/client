"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

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

const MyCoursesComponent: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null); // null for all courses

  const fetchInstructorName = async (instructorId: string): Promise<string | null> => {
    try {
      const token = Cookies.get("Token");
      const response = await fetch(
        `/api/dashboard/student/get-instructor-name?userId=${instructorId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  const fetchCourses = async () => {
    try {
      setIsLoading(true);

      const token = Cookies.get("Token");
      const url = `/api/dashboard/student/course${pendingStatus ? `?status=${pendingStatus}` : ""}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 404) {
        setCourses([]);
        setError(null);
      } else if (!response.ok) {
        throw new Error("Failed to fetch courses.");
      } else {
        const data: Course[] = await response.json();

        const coursesWithInstructorNames = await Promise.all(
          data.map(async (course) => {
            const instructorName = await fetchInstructorName(course.instructor_id);
            return { ...course, instructor_name: instructorName };
          })
        );

        setCourses(coursesWithInstructorNames);
        setError(null);
      }
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setIsLoading(false);
      setStatus(pendingStatus); // Update status only after fetching courses
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [pendingStatus]);

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
  };

  return (
    <>
      {/* Filter Bar */}
      <div className="mb-6 flex justify-left">
        <div className="bg-white shadow-lg rounded-md px-4 py-3 w-80">
          <label
            htmlFor="statusFilter"
            className="block text-sm font-medium text-black text-black"
          >
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={status || ""}
            onChange={(e) => setPendingStatus(e.target.value || null)}
            className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border-2 text-black"
          >
            <option value="">All</option>
            <option value="enrolled">Enrolled</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Courses Section */}
      <div className="text-left">
        {isLoading ? (
          <div className="text-gray-500">Loading...</div>
        ) : courses.length === 0 ? (
          <div className="text-gray-500 text-sm">
            {status
              ? `There are no ${status} courses.`
              : "No courses found. Start learning by enrolling in a course!"}
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
                  <p className="text-sm text-gray-500 mt-1">
                    {course.instructor_name || "Unknown Instructor"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {course.description}
                  </p>
                  <div className="mt-4">
                    <a
                      href={`/dashboard/courses/${course._id}`}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      Continue Course...
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyCoursesComponent;
