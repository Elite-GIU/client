"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import Loading from "../loading";
import ThreadCard from "../../../../../components/dashboard/threads/ThreadCard";
import ThreadMessages from "../../../../../components/dashboard/threads/ThreadMessages";

interface Reply {
  _id: string;
  message_id: string;
  sender_id: {
    _id: string;
    name: string;
    role: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  _id: string;
  thread_id: string;
  sender_id: {
    _id: string;
    name: string;
    role: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
  replies: Reply[];
}

interface ThreadDetail {
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

function ThreadDetailPage() {
  const [thread, setThread] = useState<ThreadDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { course_id, thread_id } = useParams<{
    course_id: string;
    thread_id: string;
  }>();

  useEffect(() => {
    const fetchThreadAndMessages = async () => {
      const token = Cookies.get("Token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Fetch thread details
        const threadResponse = await fetch(
          `/api/dashboard/courses/${course_id}/threads/${thread_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!threadResponse.ok) {
          throw new Error(
            `Error fetching thread: ${threadResponse.statusText}`
          );
        }
        const threadData = await threadResponse.json();
        setThread(threadData);

        // Fetch messages
        const messagesResponse = await fetch(
          `/api/dashboard/courses/${course_id}/threads/${thread_id}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!messagesResponse.ok) {
          throw new Error(
            `Error fetching messages: ${messagesResponse.statusText}`
          );
        }
        const messagesData = await messagesResponse.json();

        // Fetch replies for each message
        const messagesWithReplies = await Promise.all(
          messagesData.data.map(async (message: Message) => {
            const repliesResponse = await fetch(
              `/api/dashboard/courses/${course_id}/threads/${thread_id}/messages/${message._id}/`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const repliesData = await repliesResponse.json();
            return {
              ...message,
              replies: repliesData || [], // Use the fetched replies or an empty array
            };
          })
        );

        setMessages(messagesWithReplies);

        // Fetch user role
        const response = await fetch("/api/profile/role", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setRole(data.role);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("API error:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreadAndMessages();
  }, [course_id, thread_id, router]);

  const updateThread = async (
    updatedTitle: string,
    updatedDescription: string
  ) => {
    const token = Cookies.get("Token");
    if (!token) {
      console.error("Authorization token is not available");
      return;
    }

    try {
      const response = await fetch(
        `/api/dashboard/courses/${course_id}/threads/${thread_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: updatedTitle,
            description: updatedDescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update thread: ${response.statusText}`);
      }

      // Optimistically update thread state
      setThread((prevThread) =>
        prevThread
          ? {
              ...prevThread,
              title: updatedTitle,
              description: updatedDescription,
            }
          : null
      );
    } catch (error) {
      console.error("Error updating thread:", error);
    }
  };

  const deleteThread = async () => {
    const token = Cookies.get("Token");
    if (!token) {
      console.error("Authorization token is not available");
      return;
    }

    try {
      const response = await fetch(
        `/api/dashboard/courses/${course_id}/threads/${thread_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete thread: ${response.statusText}`);
      }

      router.push(`/dashboard/courses/${course_id}/threads`);
    } catch (error) {
      console.error("Error deleting thread:", error);
    }
  };
  const sendMessage = async (message: string, parentId?: string) => {
    const token = Cookies.get("Token");
    if (!token) {
      console.error("Authorization token is not available");
      return;
    }

    try {
      const response = await fetch(
        `/api/dashboard/courses/${course_id}/threads/${thread_id}/messages${
          parentId ? `/${parentId}/` : ""
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: message }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const newMessage = await response.json();

      if (parentId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (msg._id === parentId) {
              return {
                ...msg,
                replies: [...msg.replies, newMessage],
              };
            }
            return msg;
          })
        );
      } else {
        setMessages((prevMessages) => [
          { ...newMessage.data, replies: [] },
          ...prevMessages,
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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
    <div className="flex flex-col space-y-8">
      <div className="p-4">
        {thread && (
          <ThreadCard
            thread={thread}
            onDelete={deleteThread}
            onUpdate={updateThread}
            role={role}
          />
        )}
      </div>
      <div className="p-4">
        <ThreadMessages messages={messages} onSendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default ThreadDetailPage;
