"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Loading from "../loading";
import { ThreadCard } from "../components/ThreadCard";
import { Moon, Sun } from "lucide-react";

function ThreadPage() {
  const [threadMessages, setThreadMessages] = useState<
    { _id: string; thread_id: string; sender_id: string; content: string }[]
  >([]);
  const [threadMessageReplies, setThreadMessageReplies] = useState<any>({}); // Now an object holding replies per message ID
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const router = useRouter();
  const { course_id, thread_id } = useParams(); // Get course and threadMessages IDs from URL
  const searchParams = useSearchParams();
  const thread = searchParams.get("thread");
  const isDarkMode = searchParams.get("isDarkMode") === "true";
  const parsedThread = thread ? JSON.parse(thread) : null;
  // Function to fetch thread messages
  const fetchThreadMessages = async () => {
    try {
      setIsLoading(true);

      // Replace with your actual API call to get thread messages
      const response = await fetch(`/api/threads/${thread_id}/messages`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setThreadMessages(data.messages); // Store all thread messages
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch replies for a specific thread message
  const fetchMessageReplies = async (message_id: string) => {
    try {
      const token = Cookies.get("Token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Replace with your actual API call to fetch replies for a specific message
      console.log("Fetching replies for message ID: " + message_id);
      const response = await fetch(
        `/api/dashboard/courses/threads/messages?course_id=${course_id}&thread_id=${thread_id}&message_id=${message_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch replies");
      }

      const { data } = await response.json();
      console.log("dataz", data);

      // Update the state with the specific message replies
      setThreadMessageReplies((prevReplies: any) => {
        const updatedReplies = {
          ...prevReplies,
          [message_id]: data,
        };
        console.log("Updated threadMessageReplies state:", updatedReplies);
        return updatedReplies;
      });
      console.log("show me", threadMessageReplies.message_id);
    } catch (err: any) {
      setError(err.message || "Something went wrong while fetching replies");
    } finally {
      setIsLoading(false);
    }
  };
  const handleReplySubmit = (message_id: string) => {
    if (replyText.trim()) {
      // Call the function with replyText as the parameter
      replyToMessage(replyText, message_id);
      setReplyText(""); // Optionally clear the input after submission
    }
  };

  const replyToMessage = async (replyText: string, message_id: string) => {
    console.log(
      "ok bro I got the message: " + replyText + " reply to: " + message_id
    );
    const token = Cookies.get("Token");
    if (!token) {
      router.push("/login");
      return;
    }
    const response = await fetch(
      `/api/dashboard/courses/threads/messages/reply?course_id=${course_id}&thread_id=${thread_id}&message_id=${message_id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Ensure Content-Type is set to JSON
        },
        body: JSON.stringify({
          content: replyText, // Replace with your actual message content
        }),
      }
    );
    const data = await response.json();
    fetchMessageReplies(message_id); // Fetch replies again to update the UI
  };
  // Fetch thread messages on mount
  useEffect(() => {
    if (!course_id || !thread_id) return; // Wait until IDs are available

    const fetchThread = async () => {
      const token = Cookies.get("Token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `/api/dashboard/courses/threads?course_id=${course_id}&thread_id=${thread_id}`,
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
        console.log("Replies for message:", data.replies);
        setThreadMessages(data);
      } catch (error) {
        setError("Failed to load thread messages. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchThread();
  }, [course_id, thread_id, router]);

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

  if (!threadMessages) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <p className="text-gray-500 text-center">No thread messages found.</p>
      </div>
    );
  }

  const handleThreadMessageSubmit = async (thread_id: string) => {
    if (replyText.trim()) {
      const token = Cookies.get("Token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `/api/dashboard/courses/threads/messages/new?course_id=${course_id}&thread_id=${thread_id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: replyText,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to post message");
        }

        const { data } = await response.json();
        setThreadMessages((prev) => [data, ...prev]);
        setReplyText(""); // Clear the input after submission
      } catch (err: any) {
        setError(err.message || "Something went wrong while posting message");
      }
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col">
      <header className="p-4 flex justify-end bg-slate-500">
          <button
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
        <main className="flex-1 bg-[#F5F5FF] p-6 sm:p-10 space-y-4">
          {/* Thread Header */}
          <ThreadCard thread={parsedThread} isDarkMode={false} />
          <br />
          <div className="w-full space-y-4">
            <div className="text-black">
              <textarea
                className="w-full p-2 border rounded-lg"
                placeholder="Write a message..."
                onChange={(e) => setReplyText(e.target.value)} // Update state on change
              />
            </div>
            <div className="flex justify-start pl-1">
              <button
                onClick={() => handleThreadMessageSubmit(parsedThread._id)} // Call the function when the button is clicked
                className="self-center w-[97px] h-[32px] bg-[#98C1D9] text-white text-[20px] font-semibold flex items-center justify-center rounded-md shadow-[0px_1px_17.1px_rgba(0,_0,_0,_0.25)]">
                Post
              </button>
            </div>
          </div>
          <br />
          {/* Thread Messages Section */}
          <div className="space-y-4">
            {threadMessages && threadMessages.length > 0 ? (
              threadMessages.map((message: any) => (
                <div
                  key={message._id}
                  className="bg-white p-4 rounded-lg shadow-sm flex flex-col space-y-2 relative">
                  <p className="text-sm text-gray-700 font-semibold">
                    {message.sender_id.name} •{" "}
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                  <p className="text-black">{message.content}</p>

                  {/* View Replies Button */}
                  <button
                    onClick={() => fetchMessageReplies(message._id)}
                    className="place-self-start text-sm text-gray-500 font-semibold hover:underline focus:outline-none"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      letterSpacing: "-0.02em",
                    }}>
                    View Replies
                  </button>

                  {/* Display Replies for This Message */}
                  {threadMessageReplies[message._id] ? (
                    threadMessageReplies[message._id].length > 0 ? (
                      <div className="mt-4 w-9/12">
                        <div className="space-y-2">
                          {threadMessageReplies[message._id].map(
                            (reply: any) => (
                              <div
                                key={reply._id}
                                className="bg-gray-200 p-4 rounded-lg">
                                <p className="text-sm text-gray-700 font-semibold">
                                  {reply.sender_id.name} •{" "}
                                  {new Date(reply.createdAt).toLocaleString()}
                                </p>
                                <p className="text-black">{reply.content}</p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 mt-2">No replies yet.</p>
                    )
                  ) : (
                    <br></br>
                  )}

                  <div className="w-full space-y-4">
                    <div className="text-black">
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Write a reply..."
                        onChange={(e) => setReplyText(e.target.value)} // Update state on change
                      />
                    </div>
                    <div className="flex justify-start">
                      <button
                        onClick={() => handleReplySubmit(message._id)} // Call the function when the button is clicked
                        className="w-[97px] h-[32px] bg-[#98C1D9] text-white text-[20px] font-semibold flex items-center justify-center rounded-md shadow-[0px_1px_17.1px_rgba(0,_0,_0,_0.25)]">
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No messages found. Be the first to start the discussion!
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ThreadPage;
