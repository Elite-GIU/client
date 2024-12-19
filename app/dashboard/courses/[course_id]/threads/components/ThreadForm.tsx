import React, { useState } from "react";

interface ThreadFormProps {
  onSubmit: (data: { title: string; content: string }) => void;
  isDarkMode: boolean; // Accept dark mode state
}

export function ThreadForm({ onSubmit, isDarkMode }: ThreadFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content });
    setTitle(""); // Clear form fields
    setContent("");
  };

  return (
    <div
      className={`p-6 rounded-2xl shadow-md ${
        isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
      }`}>
      <h3 className="text-2xl font-bold mb-4">Create a New Thread</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-lg font-medium mb-1">Thread Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter the thread title"
            className={`w-full px-4 py-2 rounded-lg shadow-sm focus:outline-none ${
              isDarkMode
                ? "bg-slate-600 text-white border-gray-600 focus:ring-blue-400"
                : "bg-gray-100 text-black border-gray-300 focus:ring-blue-500"
            }`}
          />
        </div>

        {/* Content Textarea */}
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-medium mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write your thread content here..."
              rows={4}
              className={`w-full px-4 py-2 rounded-lg shadow-sm focus:outline-none ${
                isDarkMode
                  ? "bg-slate-600 text-white border-gray-600 focus:ring-blue-400"
                  : "bg-gray-100 text-black border-gray-300 focus:ring-blue-500"
              }`}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-[177px] h-[52px] bg-[#98C1D9] text-white text-[20px] font-semibold flex items-center justify-center rounded-[15px] shadow-[0px_1px_17.1px_rgba(0,_0,_0,_0.25)]"
              style={{
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-0.02em",
              }}>
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
