import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const StarRating: React.FC<{ course_id: string; module_id: string }> = ({
  course_id,
  module_id,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false); // Disable state for stars

  const handleHover = (index: number) => {
    if (isDisabled) return; // Prevent hover logic if disabled
    setHoverIndex(index);
    setMessage("Leave a rating?");
  };

  const handleMouseLeave = () => {
    if (isDisabled) return; // Prevent clearing hover logic if disabled
    setHoverIndex(null);
    setMessage("");
  };

  const handleClick = async (index: number) => {
    if (isDisabled) return; // Prevent clicking if disabled
    setSelectedIndex(index);

    try {
      const token = Cookies.get("Token");
      const response = await axios.post(
        `/api/dashboard/student/course/${course_id}/module/${module_id}/rate`,
        {
          rate: Math.floor(index + 1),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to submit rating");
      }

      setMessage("Thank you for your rating!");
      setIsDisabled(true); // Disable stars after successful rating
    } catch (error) {
      console.error("Error submitting rating:", error);
      setMessage("Failed to submit rating. Please try again.");
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="flex space-x-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={`cursor-pointer text-2xl ${
              isDisabled
                ? "cursor-not-allowed"
                : hoverIndex !== null && index <= hoverIndex
                ? "text-yellow-400"
                : selectedIndex !== null && index <= selectedIndex
                ? "text-yellow-400"
                : "text-gray-400"
            }`}
            onMouseEnter={() => handleHover(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          >
            ★
          </span>
        ))}
      </div>
      {message && (
        <div
          className={`absolute -top-6 -left-2 text-gray-600 text-sm opacity-0 transition-opacity duration-300 whitespace-nowrap ${
            hoverIndex !== null || message === "Thank you for your rating!"
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};
