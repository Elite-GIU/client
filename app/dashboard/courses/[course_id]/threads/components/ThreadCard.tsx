import React from "react";
import { Mail } from "lucide-react";

interface ThreadCardProps {
  thread: any; // Accept thread object
  /*
{
    title: string;
    creator_id?: {
      name: string;
      role: string;
    };
    created_at: string;
    description: string;
    replies: number;
  }; 
  */
  isDarkMode: boolean; // Accept dark mode state
}

export function ThreadCard({
  thread: { title, creator_id, created_at, description, replies },
  isDarkMode,
}: ThreadCardProps) {
  const name = creator_id?.name || "Unknown";
  const role = creator_id?.role || "user";
  const threadType = role === "instructor" ? "Announcement: " : "Discussion: ";
  return (
    <div
      className={`hover:bg-gray-200 rounded-2xl shadow-md p-6 ${
        isDarkMode
          ? "bg-gray-700 text-white hover:bg-gray-600"
          : "bg-white text-black"
      }`}>
      <h3 className="text-3xl font-bold">{threadType + title}</h3>
      <p
        className={`text-sm mt-1 ${
          isDarkMode ? "text-gray-300" : "text-[#4D4D4D]"
        }`}>
        Posted by {name} • {new Date(created_at).toLocaleString()}
      </p>
      <p className="text-xl font-semibold mt-4">{description}</p>
      <div
        className={`mt-6 pt-4 border-t flex items-center gap-2 ${
          isDarkMode ? "border-gray-500" : "border-[#CDCDCD]"
        }`}>
        <Mail className="w-5 h-5" />
        <span className="text-xl font-semibold">{replies} replies</span>
      </div>
    </div>
  );
}
