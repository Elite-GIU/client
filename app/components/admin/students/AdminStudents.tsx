"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Pagination from "../../Pagination";

interface Student {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
}

const AdminStudentsComponent = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStudents = async () => {
    try {
        const token = Cookies.get('Token');
      const query = `page=${currentPage}${
        searchTerm === "" ? "" : "&name=" + searchTerm
      }`;
      const response = await fetch(`/api/admin/students?${query}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setStudents([]);
        setCurrentPage(1);
        setTotalPages(1);
        return;
      }

      const data = await response.json();
      setStudents(data.students);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchTerm]);

  const deleteStudent = async (studentId: string) => {
    try {
      const token = Cookies.get('Token');
      if (!token) return;
      const response = await fetch(`/api/admin/students/${studentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.statusText)
      if (!response.ok) {
        throw new Error("Failed to delete the student.");
      }
      else{
        const updatedStudents = students.map((student) =>
            student._id === studentId ? { ...student, isActive: false } : student
        );

        setStudents(updatedStudents);
      }
    } catch (err) {
      alert((err as Error).message);
    }
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
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-black border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div
            key={student._id}
            className={`border rounded-lg shadow-md p-4 ${
              student.isActive ? "bg-white" : "bg-gray-200"
            }`}
          >
            <h3 className="text-lg font-medium text-black">{student.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{student.email}</p>
  
            {/* Check if the student is active and display accordingly */}
            {student.isActive ? (
              student.isActive && (
                <button
                  onClick={() => deleteStudent(student._id)}
                  className="mt-4 text-red-600 text-sm font-medium hover:underline"
                >
                  Delete
                </button>
              )
            ) : (
              <p className="text-sm text-gray-500 mt-1">Inactive</p> // Inactive students
            )}
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
  );
}
export default AdminStudentsComponent;
