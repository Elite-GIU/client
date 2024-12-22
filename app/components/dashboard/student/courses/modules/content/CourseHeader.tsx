import * as React from "react";
import { StarRating } from "./StarRating";

interface CourseHeaderProps {
  title: string;
  course_id: string;
  module_id: string;
  role: string;
  isEditing: boolean;
  isVisible: boolean;
  setIsEditing: (editing: boolean) => void;
  setIsVisible: (visible: boolean) => void;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({
  title,
  course_id,
  module_id,
  role,
  isEditing,
  isVisible,
  setIsEditing,
  setIsVisible,
}) => (
  <div className="flex justify-between items-center w-full max-md:max-w-full">
    <div className="text-2xl font-bold tracking-tighter leading-tight text-black sm:text-3xl">
      {title}
    </div>
    {role === "instructor" && !isEditing && (
      <button
        onClick={() => setIsEditing(true)}
        className="ml-4 bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition duration-300"
      >
        Update Content
      </button>
    )}
    {role === "instructor" && isEditing && (
      <div className="flex items-center">
        <label
          className="text-black mr-2 text-xl font-bold"
          style={{ marginTop: "-4px" }}
        >
          Set Visibility
        </label>
        <div
          onClick={() => setIsVisible(!isVisible)}
          className={`relative inline-block w-12 h-6 transition duration-200 ease-in cursor-pointer ${
            isVisible ? "bg-blue-500" : "bg-gray-300"
          } rounded-full`}
        >
          <div
            className={`absolute left-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
              isVisible ? "translate-x-full" : ""
            }`}
          />
        </div>
      </div>
    )}
    {role !== "instructor" && (
      <StarRating course_id={course_id} module_id={module_id} />
    )}
  </div>
);
