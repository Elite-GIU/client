"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // for redirect
import { CategoryButton } from "./components/CategoryButton";
import Header from "./components/Header";
import Cookies from "js-cookie";
import Loading from "./loading";

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

const categories = [
  "Data Science",
  "Business",
  "Security",
  "Media",
  "Software",
  "ML",
];

export default function MainContent() {
  const [courses, setCourses] = useState<any[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    setIsLoading(true);
    try {
      const response = await fetch(`/api/courses`, {
        method: "GET",
        headers: {},
      });

      if (!response.ok) {
        setCourses([]);
        return;
      }

      const data = await response.json();
      const slicedCourses = data.courses.slice(0, 6);
      const coursesWithInstructorNames = await Promise.all(
        slicedCourses.map(async (course: Course) => {
          const instructorName = await fetchInstructorName(course.instructor_id);
          return { ...course, instructor_name: instructorName };
        })
      );

      setCourses(coursesWithInstructorNames);
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAllowed = async () => {
      const token = Cookies.get("Token");
      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch("/api/auth/get-active-session", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const session = await response.json();
      if (session != token) {
        Cookies.remove("Token");
        router.push("/");
        return;
      }
    };
    checkAllowed();
    fetchCourses();
  }, []);

  const handleViewCourses = () => {
    router.push("/courses");
  };

  const handleViewInstructors = () => {
    router.push("/instructors");
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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="">
      <Header />
      <main>
        <section className="flex flex-col md:flex-row items-center justify-between p-4 text-base text-slate-600">
          <div className="flex flex-col md:w-2/3 ml-10 space-y-4">
            <h1 className="text-2xl md:text-4xl font-bold">
              Start Learning Today
            </h1>
            <p className="text-sm md:text-base">
              Transform the way you engage with tutorials. Access interactive
              learning sessions, solve programming problems, and refine your
              skills with instant feedback on your submissions. Whether you're a
              TA managing classes or a student aiming for excellence, we're here
              to make the process smoother and more effective.
            </p>
            <button 
            onClick={handleViewCourses}
            className="bg-slate-600 text-sky-100 rounded-xl px-8 py-2 w-1/4">
              Explore Courses
            </button>
          </div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ac84c068cdf462ee97515a287a74b9e5ee97583d86bfd488935e51708eed3c57"
            alt="Learning illustration"
            className="w-full md:w-1/3 max-w-xs h-auto mr-20 mt-20"
          />
        </section>

        <section className="my-10 px-4">
          <h2 className="text-3xl font-bold text-slate-600 mb-6">
            Browse Categories
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <CategoryButton key={index} label={category} />
            ))}
          </div>
        </section>

        <section className="my-10 px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-600">Featured Courses</h2>
            <div className="space-x-4">
              <button
                onClick={handleViewCourses}
                className="bg-slate-600 text-white px-4 py-2 rounded"
              >
                View All Courses
              </button>
              <button
                onClick={handleViewInstructors}
                className="bg-slate-600 text-white px-4 py-2 rounded"
              >
                View All Instructors
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="border border-gray-200 rounded-lg shadow-md overflow-hidden"
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
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
