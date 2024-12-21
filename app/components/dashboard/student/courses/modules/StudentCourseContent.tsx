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
  content: string; // This will hold the file URL
  upload_date: Date;
  last_updated: Date;
}

const StudentCourseContent: React.FC<{
  course_id: string;
  module_id: string;
  content_id: string;
  role: string; // Added role prop
}> = ({ course_id, module_id, content_id, role }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<ContentDetails>({
    _id: "",
    title: "",
    description: "",
    type: "",
    isVisible: false,
    content: "", // This will hold the file URL
    upload_date: new Date(),
    last_updated: new Date(),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(content.title);
  const [description, setDescription] = useState(content.description);
  const [file, setFile] = useState<File | null>(null);

  const fetchContent = async () => {
    const token = Cookies.get("Token");
    const endpoint =
      role === "instructor"
        ? `/api/dashboard/instructor/course/${course_id}/module/${module_id}/content/${content_id}`
        : `/api/dashboard/student/course/${course_id}/module/${module_id}/content/${content_id}`;

    try {
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch content.");
      }

      const data = await response.json();
      setContent(data);
      setTitle(data.title);
      setDescription(data.description);
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

  const handleUpdate = async () => {
    const token = Cookies.get("Token");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch(`/api/content/${content_id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        setIsEditing(false);
        fetchContent();
      } else {
        // Handle error (e.g., show an error message)
        console.error("Failed to update content.");
      }
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(content.title);
    setDescription(content.description);
    setFile(null);
  };

  if (isLoading) {
    return <div className="text-black">Loading...</div>;
  }

  if (error) {
    return <div className="text-black">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col rounded-none">
      <div className="flex flex-col px-20 pt-10 pb-10 w-full max-md:px-5 max-md:pb-24 max-md:max-w-full">
        <div className="flex flex-col px-16 pt-12 pb-12 w-full bg-white rounded-2xl shadow-[0px_1px_17px_rgba(0,0,0,0.25)] max-md:px-5 max-md:pb-24 max-md:max-w-full">
          <div className="mb-4">
            <CourseHeader
              title={
                isEditing ? (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2"
                  />
                ) : (
                  content.title
                )
              }
              course_id={course_id}
              module_id={module_id}
              role={role}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </div>
          <RenderContent
            content={content.content}
            course_id={course_id}
            module_id={module_id}
            content_id={content_id}
            role={role}
          />
        </div>
        <div className="self-start mt-14 text-3xl font-bold tracking-tighter leading-tight text-black max-md:mt-10 max-md:ml-2">
          Description
        </div>
        <div className="flex flex-col items-start pt-8 pr-20 pb-16 pl-9 mt-7 mb-0 bg-white rounded-2xl shadow-[0px_1px_17px_rgba(0,0,0,0.25)] max-md:px-5 max-md:mr-1.5 max-md:mb-2.5 max-md:max-w-full">
          <ContentDetails
            description={
              isEditing ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border p-2"
                />
              ) : (
                content.description
              )
            }
            last_updated={content.last_updated}
          />
        </div>
        {role === "instructor" && (
          <div>
            {isEditing ? (
              <>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <button
                  onClick={handleUpdate}
                  className="mt-4 bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition duration-300"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="mt-4 bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition duration-300"
                >
                  Cancel
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourseContent;
