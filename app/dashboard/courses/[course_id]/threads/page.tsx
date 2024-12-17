"use client";

import React, { Suspense, useEffect, useState } from "react";
import { ThreadCard } from "./components/ThreadCard";
import { Footer } from "./components/Footer";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";

import { Card, Skeleton } from "@nextui-org/react";
import Loading from "./loading";
import Link from "next/link";

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
        //await new Promise((resolve) => setTimeout(resolve, 4000)); // 4 seconds delay

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
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col">
        <main className="flex-1 bg-[#F5F5F5] p-6 sm:p-10">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-black">
                Course Discussion
              </h2>
              <p className="text-lg sm:text-xl font-medium mt-2 text-black">
                Join the conversation and get help from your peers
              </p>
            </div>

            {/* New Thread Button */}
            <button
              //Onclick implement create new thread
              className="w-[177px] h-[52px] bg-[#98C1D9] text-white text-[20px] font-semibold flex items-center justify-center rounded-[15px] shadow-[0px_1px_17.1px_rgba(0,_0,_0,_0.25)]"
              style={{
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-0.02em",
              }}>
              New Thread
            </button>
          </div>
          <div className="text-black space-y-4 sm:space-y-6">
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
