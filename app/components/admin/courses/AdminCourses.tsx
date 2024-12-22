"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Pagination from "../../Pagination";

interface Course {
  _id: string;
  title: string;
  category: string;
  difficulty_level: number;
  image_path: string;
  instructor_id: string;
  instructor_name: string | null;
  description: string;
  isArchived: boolean;
}

const AdminCoursesComponent = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState<"name" | "instructorName">("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const fetchCourses = async () => {
    try {
      const token = Cookies.get('Token');
      const query = `page=${currentPage}${
        searchTerm === "" ? "" : "&" + searchBy + "=" + searchTerm
      }`;
      const response = await fetch(`/api/admin/courses?${query}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setCourses([]);
        setCurrentPage(1);
        setTotalPages(1);
        return;
      }

      const data = await response.json();
      const coursesWithInstructorNames = await Promise.all(
        data.courses.map(async (course: Course) => {
            const instructorName = await fetchInstructorName(course.instructor_id);
            return { ...course, instructor_name: instructorName };
        }));

      setCourses(coursesWithInstructorNames);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm, searchBy]);

  const deleteCourse = async (courseId: string) => {
    const token = Cookies.get('Token');
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course._id !== courseId)
        );
      } else {
        const errorData = await response.json(); // Capture detailed error response
        console.error('Error Response:', errorData);
        throw new Error("Failed to delete the course.");
      }
    } catch (err) {
      alert((err as Error).message);
    }
  };

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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <div className="text-black">Loading...</div>;
  }

  if (error) {
    return <div className="text-black">Error: {error}</div>;
  }

  return (
    <div>
    <div className="mt-6 mb-6 text-center">
        <h1 className="text-2xl font-bold text-black">Courses</h1>
    </div>
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-black border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-6 flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="name"
            checked={searchBy === "name"}
            onChange={() => setSearchBy("name")}
            className="form-radio text-blue-500"
          />
          <span className="text-gray-700">Search by Name</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="instructor"
            checked={searchBy === "instructorName"}
            onChange={() => setSearchBy("instructorName")}
            className="form-radio text-blue-500"
          />
          <span className="text-gray-700">Search by Instructor</span>
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className={`border rounded-lg shadow-md overflow-hidden ${
              course.isArchived ? "bg-gray-200" : "bg-white"
            }`}
          >
            <img
              src={course.image_path}
              alt={course.title}
              className="w-full h-40 object-cover"
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
              {!course.isArchived && (
                <button
                  onClick={() => deleteCourse(course._id)}
                  className="mt-4 text-red-600 text-sm font-medium hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
      <Pagination
            currentPage={Number(currentPage)}
            totalPages={Number(totalPages)}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
            onPageClick={handlePageClick}
        />
      </div>
    </div>
    </div>
  );
};

export default AdminCoursesComponent;
