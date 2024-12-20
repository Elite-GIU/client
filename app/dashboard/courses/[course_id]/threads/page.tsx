'use client'
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import Loading from "./loading";
import Link from "next/link";
import { ThreadForm } from "../../../../components/dashboard/threads/ThreadForm";
import ThreadCard  from "../../../../components/dashboard/threads/ThreadCard";

interface Threads {
  _id: string;
  course_id: string;
  title: string;
  creator_id: {
    _id: string;
    name: string;
    role: string;
  };
  createdAt: string;
  description: string;
  messagesCount: number;
}

function ThreadsPage() {
  const [threads, setThreads] = useState<Threads[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewThread, setIsNewThread] = useState(false);

  const router = useRouter();
  const { course_id } = useParams();

  useEffect(() => {
    if (!course_id) return;

    const fetchThreads = async () => {
      const token = Cookies.get("Token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const response = await fetch(`/api/dashboard/courses/${course_id}/threads`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const { data } = await response.json();
        setThreads(data.map((thread: Threads) => ({
          ...thread,
          creator_id: thread.creator_id || { _id: '', name: 'Unknown', role: 'User' }, 
        })));
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

  async function handleNewThread(thread: { title: string; content: string }) {
    setIsNewThread(false);

    const token = Cookies.get("Token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`/api/dashboard/courses/${course_id}/threads/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: thread.title,
          description: thread.content,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const { data } = await response.json();
      setThreads((prev) => [data, ...prev]);
    } catch (error) {
      console.error("Error creating thread:", error);
      setError("Failed to create thread. Please try again later.");
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6 sm:mb-2 p-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-black">
          Course Discussion
          <p className="text-sm text-gray-600 mt-2">
            Join the conversation and get help from your peers
          </p>
        </h2>

        <button onClick={() => setIsNewThread(true)}
          className="w-[150px] h-[44px] bg-[#98C1D9] text-white text-[16px] font-medium flex items-center justify-center rounded-[12px] shadow-md"
          >
          New Thread
        </button>
      </div>
      {isNewThread && (
        <ThreadForm onSubmit={handleNewThread} />
      )}
      <div className="space-y-4 sm:space-y-6 p-4">
        {threads.map((thread) => (
          <Link key={thread._id} href={`/dashboard/courses/${course_id}/threads/${thread._id}`} legacyBehavior>
            <a className="block">
              <ThreadCard thread={thread} />
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ThreadsPage;
