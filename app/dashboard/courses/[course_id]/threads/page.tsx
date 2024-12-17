"use client";

import React, { Suspense, useEffect, useState } from "react";
import { ThreadCard } from "./components/ThreadCard";
import { Footer } from "./components/Footer";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import Loading from "./loading";
import Link from "next/link";
import { ThreadForm } from "./components/ThreadForm";
import { Moon, Sun } from "lucide-react"; // Lucide for icons

function ThreadsPage() {
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewThread, setIsNewThread] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state
  const router = useRouter();
  const { course_id } = useParams(); // Get course ID from URL
   
  useEffect(() => {
    console.log("course_id:", course_id);
    if (!course_id) return; // Wait until `course_id` is available

    const fetchThreads = async () => {
      const token = Cookies.get("Token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        console.log("Token found:", token);
        console.log("Fetching threads for course:", course_id);

        const response = await fetch(
          `/api/dashboard/courses?course_id=${course_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const { data } = await response.json();
        setThreads(data);
        console.log("Threads:", data);
      } catch (error) {
        console.error("Error fetching threads:", error);
        setError("Failed to load threads. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [course_id, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } px-4`}>
        <p
          className={`${
            isDarkMode ? "text-red-400" : "text-red-600"
          } text-center`}>
          {error}
        </p>
      </div>
    );
  }

  function handleNewThread(data: { title: string; content: string }): void {
    setIsNewThread(false);
    throw new Error("Function not implemented.");
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-slate-400 text-black"
      }`}>
      <div className="flex flex-col">
        <header className="p-4 flex justify-end">
          <button
            onClick={() => setIsDarkMode((prev) => !prev)}
            className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all ${
              isDarkMode
                ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
            aria-label="Toggle Dark Mode">
            {isDarkMode ? (
              <Moon className="w-6 h-6" />
            ) : (
              <Sun className="w-6 h-6" />
            )}
          </button>
        </header>
        <main
          className={`flex-1 ${
            isDarkMode ? "bg-gray-800" : "bg-[#F5F5FF]"
          } p-6 sm:p-10`}>
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <div>
              <h2
                className={`text-3xl sm:text-4xl font-bold ${
                  isDarkMode ? "text-white" : "text-black"
                }`}>
                Course Discussion
              </h2>
              <p
                className={`text-lg sm:text-xl font-medium mt-2 ${
                  isDarkMode ? "text-gray-300" : "text-black"
                }`}>
                Join the conversation and get help from your peers
              </p>
            </div>

            {/* New Thread Button */}
            <button
              onClick={() => setIsNewThread(true)}
              className="w-[177px] h-[52px] bg-[#98C1D9] text-white text-[20px] font-semibold flex items-center justify-center rounded-[15px] shadow-[0px_1px_17.1px_rgba(0,_0,_0,_0.25)]"
              style={{
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-0.02em",
              }}>
              New Thread
            </button>
          </div>
          {/* Thread Form */}
          {isNewThread && (
            <div className="mb-6 sm:mb-8">
              <ThreadForm onSubmit={handleNewThread} isDarkMode={isDarkMode} />
            </div>
          )}
          <div
            className={`space-y-4 sm:space-y-6 ${
              isDarkMode ? "text-gray-300" : "text-black"
            }`}>
            {Array.isArray(threads) &&
              threads.map((thread: any) => (
                <Link
                  key={thread.course_id}
                  href={{
                    pathname: `/dashboard/courses/${course_id}/threads/${thread._id}`,
                    query: {
                      title: thread.title,
                      author: thread.creator_id.name,
                      role: thread.creator_id.role,
                      created_at: thread.created_at,
                      content: thread.description,
                      isDarkMode: isDarkMode, // Pass dark mode state to the thread page
                    },
                  }}
                  legacyBehavior>
                  <a className="block">
                    {/* Ensure the entire block is clickable */}
                    <ThreadCard
                      title={thread.title}
                      author={thread.creator_id.name}
                      role={thread.creator_id.role}
                      time={new Date(thread.created_at).toLocaleString()}
                      content={thread.description}
                      replies={thread.replies}
                      isDarkMode={isDarkMode}
                    />
                  </a>
                </Link>
              ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default ThreadsPage;
