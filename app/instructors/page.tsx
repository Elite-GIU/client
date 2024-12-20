"use client";

import React, { useEffect, useState } from "react";

interface Instructor {
    name: string;
    email: string;
    preferences: string[];
    averageRating: number;
}

const InstructorsPage = () => {
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchInstructors = async () => {
        try {
            const query = `page=${currentPage}${searchTerm === "" ? "" : '&name='+searchTerm }`;
            const response = await fetch(`/api/instructors?${query}`, {
                method: "GET",
                headers: {},
            });

            if (!response.ok) {
                setInstructors([]); 
                setCurrentPage(1); 
                setTotalPages(1); 
                return;
            }
              
            const data = await response.json();
            setInstructors(data.instructors); 
            setCurrentPage(parseInt(data.pagination.currentPage)); 
            setTotalPages(parseInt(data.pagination.totalPages));
        } catch (err) {
            setError((err as Error).message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInstructors();
    }, [currentPage, searchTerm]);

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
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {Array.isArray(instructors) && instructors.length === 0 ? (
                <div className="text-center text-gray-500 text-sm">
                    No instructors found.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(instructors) && instructors.map((instructor, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                            <div className="p-4">
                                <h3 className="text-lg font-medium mt-2 text-black">{instructor.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{instructor.email}</p>
                                <ul className="text-sm text-gray-600 mt-1">
                                    {instructor.preferences.map((preference, index) => (
                                        <li key={index}>{preference}</li>
                                    ))}
                                </ul>
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

export default InstructorsPage;
