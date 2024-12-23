"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Header from "../components/Header";
import Loading from "../loading";
import { useRouter } from "next/navigation";

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

const CoursesPage = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchBy, setSearchBy] = useState<"name" | "instructorName">("name");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [notification, setNotification] = useState<string | null>(null); // Notification state
    const router = useRouter();

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
            return data; // Assuming the API returns the instructor name as a plain string
        } catch (err) {
            console.error("Error fetching instructor name:", err);
            return "Unknown Instructor";
        }
    };

    const fetchCourses = async () => {
        try {
            const query = `page=${currentPage}${searchTerm === "" ? "" : '&'+searchBy+'='+searchTerm }`;
            const response = await fetch(`/api/courses?${query}`, {
                method: "GET",
                headers: {},
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
                })
            );

            setCourses(coursesWithInstructorNames);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError((err as Error).message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    const enrollInCourse = async (courseId: string) => {
        try {
            const token = Cookies.get("Token");
            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(`/api/dashboard/student/course/${courseId}/assign`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                setNotification("Successfully enrolled in the course!");
            } else if (response.status === 400) {
                setNotification("You are already enrolled in this course!");
            } else {
                throw new Error("Enrollment failed.");
            }
        } catch (err) {
            console.error("Error enrolling in course:", err);
            setNotification("Failed to enroll in the course.");
        } finally {
            setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [currentPage, searchTerm, searchBy]);

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

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(parseInt(currentPage.toString(), 10) + 1);
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
        return <Loading />;
    }

    if (error) {
        return <div className="text-black">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <div className="flex-grow container mx-auto p-4 relative">
                <h1 className="text-2xl font-bold text-center mb-4 text-black">Discover Courses</h1>
                <p className="text-center text-gray-600 mb-6 text-black">
                    Explore our wide range of courses and start learning today
                </p>
                <div className="relative text-black max-w-2xl mx-auto mb-8">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 pl-12 bg-white rounded-lg shadow-sm border border-gray-200 focus:border-[#3D5A80] focus:ring-2 focus:ring-[#3D5A80] transition-all"
                    />
                </div>
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setSearchBy("name")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            searchBy === "name" ? "bg-[#3D5A80] text-white" : "text-black hover:bg-gray-100"
                        }`}
                    >
                        Search by Name
                    </button>
                    <button
                        onClick={() => setSearchBy("instructorName")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            searchBy === "instructorName" ? "bg-[#3D5A80] text-white" : "text-black hover:bg-gray-100"
                        }`}
                    >
                        Search by Instructor
                    </button>
                </div>
                {notification && (
                    <div
                        className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#3D5A80] text-white px-6 py-3 rounded-lg shadow-lg z-50"
                    >
                        {notification}
                    </div>
                )}
                {courses.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm">No courses found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div
                                key={course._id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                            >
                                <div className="aspect-video relative overflow-hidden bg-gray-100">
                                    <img
                                        src={course.image_path}
                                        alt={course.title}
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                    />
                                    <span className="absolute top-4 left-4 px-3 py-1 bg-[#3D5A80] text-white text-xs font-medium rounded-full">
                                        {course.category}
                                    </span>
                                </div>
                                <div className="p-6">
                                    {getDifficultyBadge(course.difficulty_level)}
                                    <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-black">{course.title}</h3>
                                    <p className="text-sm mb-4 line-clamp-2 text-black">{course.description}</p>
                                    <div className="flex items-center text-sm text-gray-500 mb-4">
                                        <span className="font-medium">{course.instructor_name || "Unknown Instructor"}</span>
                                    </div>
                                    <button
                                        onClick={() => enrollInCourse(course._id)}
                                        className="w-full px-4 py-2 bg-[#3D5A80] text-white rounded-lg hover:bg-[#2B445F] transition-colors"
                                    >
                                        Enroll
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 mx-1 bg-gray-300 text-black rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageClick(index + 1)}
                            className={`px-4 py-2 mx-1 ${
                                currentPage === index + 1 ? "bg-[#3D5A80] text-white" : "bg-gray-300 text-black"
                            } rounded`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 mx-1 bg-gray-300 text-black rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
            <footer className="flex gap-2.5 items-center w-full text-center text-black min-h-[96px] max-md:max-w-full">
                <div className="flex overflow-hidden relative flex-wrap flex-1 shrink gap-4 items-start self-stretch my-auto w-full border-t basis-0 bg-zinc-100 border-zinc-300 min-h-[96px] min-w-[240px] max-md:max-w-full">
                    <div className="absolute z-0 text-xs leading-8 bottom-[21px] h-[31px] left-[650px] w-[263px]">
                    Copyright © 2024 tutorFlow. All rights reserved.
                    </div>
                    <div className="absolute z-0 h-8 text-base font-bold tracking-tight leading-5 left-[620px] top-[23px] w-[327px]">
                    <span className="text-slate-600">tutor</span>
                    <span className="text-slate-300">Flow</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CoursesPage;
