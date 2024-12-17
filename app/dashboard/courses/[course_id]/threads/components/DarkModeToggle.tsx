import React from "react";
import { Moon, Sun } from "lucide-react"; // Lucide for icons

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export function DarkModeToggle({ isDarkMode, onToggle }: DarkModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all ${
        isDarkMode
          ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
      }`}
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? (
        <Moon className="w-6 h-6" />
      ) : (
        <Sun className="w-6 h-6" />
      )}
    </button>
  );
}
