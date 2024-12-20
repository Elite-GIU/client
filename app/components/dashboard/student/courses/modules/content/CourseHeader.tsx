import * as React from "react";
import { StarRating } from "./StarRating";
import { CourseHeaderProps } from "./types";

export const CourseHeader: React.FC<CourseHeaderProps> = ({
  title,
  rating,
  totalRatings,
}) => (
  <>
    <div className="flex flex-wrap gap-5 justify-between w-full max-md:max-w-full">
      <div className="text-3xl font-bold tracking-tighter leading-tight text-black">
        {title}
      </div>
      <StarRating rating={rating} />
    </div>
    <div className="self-start mt-2.5 mb-0 ml-5 text-sm tracking-tight leading-4 text-black max-md:mb-2.5 max-md:ml-2.5">
      {rating} ({totalRatings} ratings)
      <br />
    </div>
  </>
);
