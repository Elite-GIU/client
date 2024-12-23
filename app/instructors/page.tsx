"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Loading from "../loading";

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
      const query = `page=${currentPage}${searchTerm === "" ? "" : "&name=" + searchTerm}`;
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

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <span key={`full-${index}`} className="text-yellow-400 text-lg">★</span>
          ))}
        {halfStar && <span className="text-yellow-400 text-lg">☆</span>}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <span key={`empty-${index}`} className="text-gray-300 text-lg">★</span>
          ))}
      </div>
    );
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
    return <Loading />;
  }

  if (error) {
    return <div className="text-black">Error: {error}</div>;
  }

  return (
    <>
    <Header />
    
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="container mx-auto p-4 relative">
        <h1 className="text-2xl font-bold text-center mb-4 text-black">Meet Our Instructors</h1>
        <p className="text-center text-gray-600 mb-6 text-black">
          Discover experienced instructors across various fields.
        </p>
        <div className="relative text-black max-w-2xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-white rounded-lg shadow-sm border border-gray-200 focus:border-[#3D5A80] focus:ring-2 focus:ring-[#3D5A80] transition-all"
          />
        </div>
        {Array.isArray(instructors) && instructors.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">No instructors found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((instructor, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-black">{instructor.name}</h3>
                  <p className="text-sm mb-2 text-black">{instructor.email}</p>
                  <div className="mb-2">
                    <span className="text-gray-600 text-sm font-medium">Preferences:</span>
                    <ul className="list-disc ml-5 mt-1 text-sm text-gray-700 space-y-1">
                      {instructor.preferences.map((preference, index) => (
                        <li key={index}>{preference}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <span className="text-gray-600 text-sm font-medium">Rating:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-gray-900 font-medium text-sm">
                        {instructor.averageRating.toFixed(1)}/5
                      </span>
                      {renderStars(instructor.averageRating)}
                    </div>
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
    </div>
    </>
  );
};

export default InstructorsPage;
