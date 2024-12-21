import React, { useEffect, useState } from "react";
import { User, BookOpen, Calendar } from "lucide-react";
import Cookies from "js-cookie";
import Image from "next/image";

interface Course {
  _id: string;
  title: string;
  category: string;
  difficulty_level: number;
  image_path: string;
  instructor_id: string;
  instructor_name: string | null;
  description: string;
  created_at: string;
}
interface Instructor {
  _id: string;
  name: string;
}

const StudentCourse = ({ id }: { id: string }) => {
  const [course, setCourse] = useState<Course>({
    _id: "",
    title: "",
    category: "",
    difficulty_level: 0,
    image_path: "",
    instructor_id: "",
    instructor_name: "",
    description: "",
    created_at: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = async () => {
    try {
      const token = Cookies.get("Token");
      const response = await fetch(`/api/dashboard/student/course/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch course.");
      }

      const data = await response.json();
      console.log(data);

      // Extract the course from the fetched data
      if (data && data.course) {
        setCourse(data.course);
        const instructor_name = await fetchInstructorName(
          data.course.instructor_id
        );
        setCourse((prevCourse) => ({ ...prevCourse, instructor_name }));
      } else {
        throw new Error("Course data is not available.");
      }
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInstructorName = async (
    instructorId: string
  ): Promise<string | null> => {
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
      return data;
    } catch (err) {
      console.error("Error fetching instructor name:", err);
      return "Unknown Instructor"; // Fallback
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">
          Loading course details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600 text-center">Course not found</p>
      </div>
    );
  }

  //const difficulty = getDifficultyStyle(course.difficulty_level);
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
        <p className="text-lg font-medium mt-2 text-black">{course.title}</p>
        <p className="text-sm text-gray-500 mt-1">
          {course.instructor_name || "Unknown Instructor"}
        </p>
        {/* Truncate description to two lines */}
        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
          {course.description}
        </p>
        <div className="mt-4">
          <a
            href={`/dashboard/courses/${course._id}`} //update to be the module
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Continue Learning ...
          </a>
        </div>
      </div>
    </div>
  );
};

export default StudentCourse;
