import * as React from "react";
import { StarRating } from "./StarRating";

interface CourseHeaderProps {
  title: string;
  course_id: string;
  module_id: string;
  role: string;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void; // Added setIsEditing prop
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({
  title,
  course_id,
  module_id,
  role,
  isEditing,
  setIsEditing,
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
    {role !== "instructor" && (
      <StarRating course_id={course_id} module_id={module_id} />
    )}
  </div>
);
