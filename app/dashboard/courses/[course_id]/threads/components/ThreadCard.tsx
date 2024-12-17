import React from "react";
import { Mail } from "lucide-react";

interface ThreadCardProps {
  title: string;
  author: string;
  role: string;
  time: string;
  content: string;
  replies: number;
  isDarkMode: boolean; // Accept dark mode state
}

export function ThreadCard({
  title,
  author,
  role,
  time,
  content,
  replies,
  isDarkMode,
}: ThreadCardProps) {
  const threadType = role === "instructor" ? "Announcement: " : "Discussion: ";
  return (
    <div
      className={`hover:bg-gray-200 rounded-2xl shadow-md p-6 ${
        isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white text-black"
      }`}
    >
      <h3 className="text-3xl font-bold">{threadType + title}</h3>
      <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-300" : "text-[#4D4D4D]"}`}>
        Posted by {author} • {new Date(time).toLocaleString()}
      </p>
      <p className="text-xl font-semibold mt-4">{content}</p>
      <div
        className={`mt-6 pt-4 border-t flex items-center gap-2 ${
          isDarkMode ? "border-gray-500" : "border-[#CDCDCD]"
        }`}
      >
        <Mail className="w-5 h-5" />
        <span className="text-xl font-semibold">{replies} replies</span>
      </div>
    </div>
  );
}
