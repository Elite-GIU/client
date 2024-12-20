import * as React from "react";
import { StarRatingProps } from "./types";

const starSizes = {
  sm: "w-4",
  md: "w-5",
  lg: "w-6",
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = "md",
}) => {
  const stars = Array.from({ length: maxStars }, (_, index) => ({
    filled: index < Math.floor(rating),
    key: index,
  }));

  return (
    <div
      className="flex gap-2 self-start mt-1"
      role="img"
      aria-label={`Rating: ${rating} out of ${maxStars} stars`}
    >
      {stars.map(({ filled, key }) => (
        <svg
          key={key}
          className={`${starSizes[size]} aspect-square text-yellow-400`}
          fill={filled ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ))}
    </div>
  );
};
