import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

  
  export const CourseStarRating: React.FC<{ course_id: string }> = ({
    course_id,
  }) => {
    const [hoverIndexCourse, setHoverIndexCourse] = useState<number | null>(null);
    const [selectedIndexCourse, setSelectedIndexCourse] = useState<number | null>(null);
    const [hoverIndexInst, setHoverIndexInst] = useState<number | null>(null);
    const [selectedIndexInst, setSelectedIndexInst] = useState<number | null>(null);
    const [message, setMessage] = useState<string>("");
    const [isDisabledCourse, setIsDisabledCourse] = useState<boolean>(false); // Disable state for stars
    const [isDisabledInst, setIsDisabledInst] = useState<boolean>(false); // Disable state for stars
  
    const handleHover = (index: number, type: string) => {
      if (type==="course" && isDisabledCourse)
        return;
      if (type==="instructor" && isDisabledInst)
        return;
      if (type==="course")
        setHoverIndexCourse(index);
      else
        setHoverIndexInst(index)
      setMessage("Leave a rating?");
    };
  
    const handleMouseLeave = (type:string) => {
        if (type==="course" && isDisabledCourse)
            return;
          if (type==="instructor" && isDisabledInst)
            return;
      if (type==="course")
        setHoverIndexCourse(null);
      else
        setHoverIndexInst(null)
      setMessage("");
    };
  
    const handleClick = async (index: number, type: string) => {
        if (type==="course" && isDisabledCourse)
            return;
          if (type==="instructor" && isDisabledInst)
            return;
      if (type==="course")
        setSelectedIndexCourse(index);
      else
        setSelectedIndexInst(index);
      let response;
      index=index+1
      try {
        const token = Cookies.get("Token");
        if (type=="course") {

            response = await fetch(`/api/dashboard/student/course/${course_id}/rate`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  course_rate: index
                }),
              });
            
        }
        else
        {
            response = await fetch(`/api/dashboard/student/course/${course_id}/rate`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  instructor_rate: index
                }),
              });
        }
        setMessage("Thank you for your rating!");
        if (type === "course") setIsDisabledCourse(true);
        else setIsDisabledInst(true);
      } catch (error) {
        console.error("Error submitting rating:", error);
        setMessage("Failed to submit rating. Please try again.");
      }
    };
    return (
        <div className="flex flex-col items-end">
          {/* Course Rating */}
          <div className="w-full mr-7 mb-6 text-end">
            <h2 className="text-xs font-semibold text-gray-700 mb-2 pr-8">Rate the Course</h2>
            <div className="flex justify-end space-x-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={`cursor-pointer text-3xl transition-transform duration-300 ${
                    isDisabledCourse
                      ? "cursor-not-allowed text-gray-300"
                      : hoverIndexCourse !== null && index <= hoverIndexCourse
                      ? "text-yellow-400 scale-110"
                      : selectedIndexCourse !== null && index <= selectedIndexCourse
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                  onMouseEnter={() => handleHover(index, "course")}
                  onMouseLeave={() => handleMouseLeave("course")}
                  onClick={() => handleClick(index, "course")}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
    
          {/* Instructor Rating */}
          <div className="w-full mr-7 text-end">
            <h2 className="text-xs font-semibold text-gray-700 mb-2 pr-7">Rate the Instructor</h2>
            <div className="flex justify-end space-x-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={`cursor-pointer text-3xl transition-transform duration-300 ${
                    isDisabledInst
                      ? "cursor-not-allowed text-gray-300"
                      : hoverIndexInst !== null && index <= hoverIndexInst
                      ? "text-yellow-400 scale-110"
                      : selectedIndexInst !== null && index <= selectedIndexInst
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                  onMouseEnter={() => handleHover(index, "instructor")}
                  onMouseLeave={() => handleMouseLeave("instructor")}
                  onClick={() => handleClick(index, "instructor")}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
    
          {/* Fixed Height Container for Message */}
          <div className="h-6 mr-7 mt-4 flex items-center justify-center text-gray-600 text-sm">
            {message}
          </div>
        </div>
      );
    
  }