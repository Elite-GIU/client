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
  'Data Science',
  'Business',
  'Security',
  'Media',
  'Software',
  'ML'
];

export default function MainContent() {
  const [courses, setCourses] = useState<any[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses from API
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
  setIsLoading(true); // Set loading state to true
  try {
      // const query = `page=${currentPage}&${searchBy}=${searchTerm}`;
    
      const response = await fetch(`/api/courses`, {
          method: "GET",
          headers: {},
      });

      if (!response.ok) {
          setCourses([]);
          return;
      }

      const data = await response.json();
    
      // Slice first, get the first 6 courses
      const slicedCourses = data.courses.slice(0, 6);
      
      // Then fetch instructor names for the sliced courses
      const coursesWithInstructorNames = await Promise.all(
        slicedCourses.map(async (course: Course) => {
          const instructorName = await fetchInstructorName(course.instructor_id);
          return { ...course, instructor_name: instructorName };
        })
      );

      // Set the courses with instructor names
      setCourses(coursesWithInstructorNames);
  } catch (err) {
      setError((err as Error).message || "Something went wrong.");
  } finally {
      setIsLoading(false);
  }
};

  useEffect(() => {
    const checkAllowed = async () => {
      const token = Cookies.get('Token');
      if (!token) {
        router.push('/');
        return;
      }

      const response = await fetch('/api/auth/get-active-session', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const session = await response.json();
      if (session != token) {
        Cookies.remove('Token');
        router.push('/');
        return;
      }    
    };
    checkAllowed();
    fetchCourses();
    }, []);

  // Handler for View All Courses button
  const handleViewCourses = () => {
    router.push("/courses"); // Redirect to /courses page
  };

  // Handler for View Instructors button
  const handleViewInstructors = () => {
    router.push("/instructors"); // Redirect to /instructors page
  };
  const getDifficultyBadge = (level: number) => {
    if (level === 1) {
        return <span className="text-xs text-green-700 bg-green-100 py-1 px-2 rounded">Easy</span>;
    } else if (level === 2) {
        return <span className="text-xs text-orange-700 bg-orange-100 py-1 px-2 rounded">Intermediate</span>;
    } else if (level === 3) {
        return <span className="text-xs text-red-700 bg-red-100 py-1 px-2 rounded">Hard</span>;
    }
    return null;
};

if (isLoading) {
  return <Loading />;
}

  return (
    <div>
      <div>
        <Header />
      </div>
      <div>
        <main>
        <section className="flex flex-col md:flex-row items-center px-16 justify-center p-4 text-base text-slate-600 max-w-full mx-auto">
<div className="bg-blue-300 bg-opacity-20 rounded-[33px] w-full p overflow-hidden">
  <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-8">
    <div className="w-full md:w-2/3 px-4 md:px-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-4">
        Start Learning Today
      </h1>
      <p className="text-sm md:text-base mb-4">
        Transform the way you engage with tutorials. Access interactive learning sessions, solve programming problems, and refine your skills with instant feedback on your submissions. Whether you're a TA managing classes or a student aiming for excellence, we're here to make the process smoother and more effective.
      </p>
      <button className="bg-slate-600 text-sky-100 rounded-xl px-8 py-2 w-full md:w-auto">
        Explore Courses
      </button>
    </div>
    <img
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/ac84c068cdf462ee97515a287a74b9e5ee97583d86bfd488935e51708eed3c57?placeholderIfAbsent=true&apiKey=243f119144084a878d11ef416bccfde3"
      alt="Learning illustration"
      className="w-1/2 md:w-1/3 max-w-xs md:max-w-md h-auto my-4 md:my-0"
      style={ { maxWidth: '300px' } }
    />
  </div>
</div>
</section>

          <section className="mx-10 flex relative gap-5 items-start w-full leading-none min-h-[120px] max-md:max-w-full">
            <h2 className="absolute gap-5 top-3 z-0 h-7 text-3xl font-bold left-[29px] text-slate-600 w-[303px]">
              Browse Categories
            </h2>
            <div className="flex absolute bottom-2 gap-6 left-[29px] right-[29px] text-gray-700">
              {categories.map((category, index) => (
                <CategoryButton key={index} label={category} />
              ))}
            </div>
          </section>

          <section className="mt-10 mx-10 flex relative gap-2.5 items-start w-full min-h-[90px] max-md:max-w-full">
            <h2 className="absolute top-6 left-7 z-0 h-7 text-3xl font-bold leading-none text-slate-600 w-[303px]">
              Featured Courses
            </h2>
            <button
              onClick={handleViewCourses}
              className="absolute gap-2 self-stretch p-2 text-base leading-none text-white rounded-xl bg-slate-600 right-[110px] top-[22px] w-[101px]"
            >
              View All Courses
            </button>
            <button
              onClick={handleViewInstructors}
              className="absolute gap-2 self-stretch p-2 text-base leading-none text-white rounded-xl bg-slate-600 right-[250px] top-[22px] w-[101px]"
            >
              View All Instructors
            </button>
            </section>
            <section className="mx-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8 py-8">
              {isLoading ? (
                <div className="text-black col-span-full flex justify-center items-center h-full">
                  <Loading />
                </div>
              ) : (
                courses.map((course) => (
                  <div key={course._id} className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                    <img src={course.image_path} alt={course.title} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      {getDifficultyBadge(course.difficulty_level)}
                      <h3 className="text-lg font-medium mt-2 text-black">{course.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{course.instructor_name || "Unknown Instructor"}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">{course.description}</p>
                      <div className="mt-4">
                        <a href={`/dashboard/courses/${course._id}`} className="text-blue-600 text-sm font-medium hover:underline">
                          Apply
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </section>

        </main>
      </div>
    </div>
  );
}

