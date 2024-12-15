"use client";

import React, { useEffect, useState } from "react";
import { ThreadCard } from "./components/ThreadCard";
import { Footer } from "./components/Footer";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";

function ThreadsPage() {
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    return (
      <div className="text-black min-h-screen flex items-center justify-center bg-white">
        <p>Loading threads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  console.log(
    "Threadsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss: " +
      threads
  );
  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <main className="flex-1 bg-[#F5F5F5] p-10">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-black">Course Discussion</h2>
            <p className="text-xl font-medium mt-2 text-black">
              Join the conversation and get help from your peers
            </p>
          </div>

          <div className="text-black space-y-6">
            {Array.isArray(threads) &&
              threads.map((thread: any) => (
                <ThreadCard
                  key={thread.course_id}
                  title={thread.title}
                  author={thread.creator_id.name}
                  time={thread.created_at}
                  content={thread.description}
                  replies={thread.replies}
                />
              ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default ThreadsPage;
