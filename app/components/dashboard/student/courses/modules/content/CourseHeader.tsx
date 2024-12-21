import * as React from "react";
import { StarRating } from "./StarRating";
import { CourseHeaderProps } from "./types";

export const CourseHeader: React.FC<CourseHeaderProps> = ({
  title,
  course_id,
  module_id,
}) => (
  <>
    <div className="flex flex-wrap gap-5 justify-between w-full max-md:max-w-full">
      <div className="text-2xl font-bold tracking-tighter leading-tight text-black sm:text-3xl">
        {title}
      </div>
      <StarRating course_id={course_id} module_id={module_id} />
    </div>
  </>
);
