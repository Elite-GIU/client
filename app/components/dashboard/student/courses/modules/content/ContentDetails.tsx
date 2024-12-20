import * as React from "react";
import { ContentDetailsProps } from "./types";

export const ContentDetails: React.FC<ContentDetailsProps> = ({
  description,
  last_updated,
}) => (
  <>
    <div className="text-xl font-semibold tracking-tight leading-tight text-black whitespace-nowrap">
      {description}
    </div>
    <br />
    <div className="flex items-center text-gray-500">
      <div className="text-sm font-semibold tracking-tight leading-tight whitespace-nowrap">
        Last Updated:{" "}
      </div>
      <div className="px-5 text-sm font-semibold tracking-tight leading-tight whitespace-nowrap">
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
  </>
);
