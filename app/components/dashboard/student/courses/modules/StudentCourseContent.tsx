"use client";
import { useState, useEffect } from "react";
import { CourseHeader } from "./content/CourseHeader";
import { ContentDetails } from "./content/ContentDetails";
import Cookies from "js-cookie";
import RenderContent from "./content/RenderContent";

interface ContentDetails {
  _id: string;
  title: string;
  description: string;
  type: string;
  isVisible: boolean;
  content: string;
  upload_date: Date;
  last_updated: Date;
}

const StudentCourseContent: React.FC<{
  course_id: string;
  module_id: string;
  content_id: string;
}> = ({ course_id, module_id, content_id }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<ContentDetails>({
    _id: "",
    title: "",
    description: "",
    type: "",
    isVisible: false,
    content: "",
    upload_date: new Date(),
    last_updated: new Date(),
  });

  const fetchContent = async () => {
    try {
      const token = Cookies.get("Token");
      const response = await fetch(
        `/api/dashboard/student/course/${course_id}/module/${module_id}/content/${content_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch content.");
      }

      const data = await response.json();
      setContent(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch content.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  if (isLoading) {
    return <div className="text-black">Loading...</div>;
  }

  if (error) {
    return <div className="text-black">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col rounded-none">
      <div className="flex flex-col px-20 pt-10 pb-10 w-full bg-neutral-100 max-md:px-5 max-md:pb-24 max-md:max-w-full">
        {" "}
        {/* Adjusted pb from 44 to 10 */}
        <div className="flex flex-col px-16 pt-12 pb-12 w-full bg-white rounded-2xl shadow-[0px_1px_17px_rgba(0,0,0,0.25)] max-md:px-5 max-md:pb-24 max-md:max-w-full">
          {" "}
          {/* Adjusted pb from 96 to 0 */}
          <div className="mb-4">
            <CourseHeader
              title={content.title}
              course_id={course_id}
              module_id={module_id}
            />
          </div>
          <RenderContent
            content={content.content}
            course_id={course_id}
            module_id={module_id}
            content_id={content_id}
          />
        </div>
        <div className="self-start mt-14 text-3xl font-bold tracking-tighter leading-tight text-black max-md:mt-10 max-md:ml-2">
          Description
        </div>
        <div className="flex flex-col items-start pt-8 pr-20 pb-16 pl-9 mt-7 mb-0 bg-white rounded-2xl shadow-[0px_1px_17px_rgba(0,0,0,0.25)] max-md:px-5 max-md:mr-1.5 max-md:mb-2.5 max-md:max-w-full">
          <ContentDetails
            description={content.description}
            last_updated={content.last_updated}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentCourseContent;
