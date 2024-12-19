"use client";

import React, { useEffect, useState } from "react";
import { ThreadCard } from "./components/ThreadCard";
import { Footer } from "./components/Footer";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import Loading from "./loading";
import Link from "next/link";
import { ThreadForm } from "./components/ThreadForm";
import { Moon, Sun } from "lucide-react";

function ThreadsPage() {
  // For our thread list
  const [threads, setThreads] = useState<
    { _id: string; course_id: string; title: string; content: string }[]
  >([]);

  // For loading and error and dark mode states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // For creatign a new thread
  const [isNewThread, setIsNewThread] = useState(false);

  // Get course ID from URL
  const router = useRouter();
  const { course_id } = useParams();

  // First fetch the threads for the course
  useEffect(() => {
    // Wait until `course_id` is available
    if (!course_id) return;

    const fetchThreads = async () => {
      // Check if user is authenticated
      const token = Cookies.get("Token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Fetch threads for the course
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

        // Set threads state with response data
        const { data } = await response.json();
        setThreads(data);
      } catch (error) {
        console.error("Error fetching threads:", error);
        setError("Failed to load threads. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [course_id, router]);

  // Cool loading animation
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

  // Create a new thread
  async function handleNewThread(thread: { title: string; content: string }) {
    // Make the thread form disappear
    setIsNewThread(false);

    const token = Cookies.get("Token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Create a new thread
    try {
      const response = await fetch(
        `/api/dashboard/courses/threads/post?course_id=${course_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: thread.title,
            content: thread.content,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Add the new thread to the list
      const { data } = await response.json();
      console.log("New thread:", data);
      console.log("Response:", response);
      setThreads((prev) => [data, ...prev]);
    } catch (error) {
      console.error("Error creating thread:", error);
      setError("Failed to create thread. Please try again later.");
    }
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-slate-500 text-black"
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

          {/* Thread List */}
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
                      thread: JSON.stringify(thread),
                      isDarkMode: isDarkMode, // Pass dark mode state to the thread page
                    },
                  }}
                  legacyBehavior>
                  <a className="block">
                    {/* Ensure the entire block is clickable */}
                    <ThreadCard thread={thread} isDarkMode={isDarkMode} />
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
