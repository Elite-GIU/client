import * as React from "react";
import { ContentDetailsProps } from "./types";

export const ContentDetails: React.FC<ContentDetailsProps> = ({
  description,
  last_updated,
}) => (
  <div className="p-4 md:p-6">
    <div className="text-lg md:text-xl font-semibold tracking-tight leading-snug text-black break-words">
      {description}
    </div>
    <br />
    <div className="flex flex-col md:flex-row items-start md:items-center text-gray-500">
      <div className="text-sm font-semibold tracking-tight leading-tight whitespace-nowrap mb-2 md:mb-0">
        Last Updated:
      </div>
      <div className="md:px-5 text-sm font-semibold tracking-tight leading-tight">
        {new Date(last_updated).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </div>
    </div>
  </div>
);
