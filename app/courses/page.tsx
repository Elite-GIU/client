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

const CoursesPage = () => {
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
            // const query = `page=${currentPage}&${searchBy}=${searchTerm}`;
            console.log(searchTerm);
            console.log(searchTerm.length);
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

    const filteredCourses = courses.filter((course) => {
        if (searchBy === "name") {
            return course.title.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
            return course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });

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
        return <div className="text-black">Loading...</div>;
    }

    if (error) {
        return <div className="text-black">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            {filteredCourses.length === 0 ? (
                <div className="text-center text-gray-500 text-sm">
                    No courses found.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
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
                    ))}
                </div>
            )}
            <div className="flex justify-center mt-6">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageClick(index + 1)}
                        className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"} rounded`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CoursesPage;