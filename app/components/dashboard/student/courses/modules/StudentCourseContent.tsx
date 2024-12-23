"use client";
import { useState, useEffect } from "react";
import { CourseHeader } from "./content/CourseHeader";
import { ContentDetails } from "./content/ContentDetails";
import Cookies from "js-cookie";
import RenderContent from "./content/RenderContent";
import { useSidebarUpdate } from "@/app/components/dashboard/student/courses/SidebarContext";

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
  role: string;
}> = ({ course_id, module_id, content_id, role }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const { triggerUpdate } = useSidebarUpdate();
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
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(content.title);
  const [description, setDescription] = useState(content.description);
  const [file, setFile] = useState<File | null>(null);
  const [isVisible, setIsVisible] = useState(content.isVisible);

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
      setIsVisible(data.isVisible);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to fetch content.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const validateInputs = () => {
    let isValid = true;
    setTitleError(null);
    setDescriptionError(null);

    if (title.trim().length <= 3) {
      setTitleError("Title must contain more than 3 characters.");
      isValid = false;
    }

    if (description.trim().length <= 10) {
      setDescriptionError("Description contain more than 10 characters.");
      isValid = false;
    }

    return isValid;
  };

  const handleUpdate = async () => {
    const token = Cookies.get("Token");

    if (!validateInputs()) {
      return;
    }
    

    // Form data to send along with the file
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("isVisible", JSON.stringify(isVisible));

    if (file) {
      const maxFileSize = 100 * 1024 * 1024;
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (fileExtension !== "pdf" && fileExtension !== "mp4") {
        setErrorMessage("Invalid file type.");
        return;
      }

      if (file.size > maxFileSize) {
        setErrorMessage("File size exceeds the maximum limit of 100MB.");
        return;
      }

      formData.append("file", file);
      formData.append("type", fileExtension === "pdf" ? "document" : "video");
    }

    try {
      const response = await fetch(
        `/api/dashboard/instructor/course/${course_id}/module/${module_id}/content/${content_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setIsEditing(false);
        fetchContent();
        setErrorMessage(null);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to update content.");
      }
    } catch (error) {
      console.error("Error updating content:", error);
      setErrorMessage("An unexpected error occurred.");
    }

    triggerUpdate(); 
    
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(content.title);
    setDescription(content.description);
    setFile(null);
    setIsVisible(content.isVisible);
    setErrorMessage(null)
    setDescriptionError(null)
    setTitleError(null)
  };

  if (isLoading) {
    return <div className="text-black">Loading...</div>;
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
                    className={`border ${
                      title ? "border-blue-500" : "border-gray-300"
                    } rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                ) : (
                  content.title
                )
              }
              course_id={course_id}
              module_id={module_id}
              role={role}
              isEditing={isEditing}
              isVisible={isVisible}
              setIsEditing={setIsEditing}
              setIsVisible={setIsVisible}
            />
            {titleError && <div className="text-red-500">{titleError}</div>}
          </div>
          {role === "instructor" && isEditing && (
            <div className="flex items-center mb-4">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="border border-gray-300 rounded-md p-2 mr-2 cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              {errorMessage && (
                <div className="text-red-500">{errorMessage}</div>
              )}
            </div>
          )}
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
        <div className="flex flex-col items-start pt-8 pr-20 pb-16 pl-9 mt-7 mb-0 bg-white rounded-2xl shadow-[0px_1px_17px_rgba(0,0,0,0.25)] max-md:px-5 max-md:mr-1.5 max-md:mb-2.5 max-md:max-w-full break-all">
          <ContentDetails
            description={
              isEditing ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`border ${
                    description ? "border-blue-500" : "border-gray-300"
                  } rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32`}
                />
              ) : (
                content.description
              )
            }
            last_updated={content.last_updated}
          />
          {descriptionError && (
            <div className="text-red-500">{descriptionError}</div>
          )}
        </div>
        {role === "instructor" && isEditing && (
          <div className="flex items-center mt-4">
            <button
              onClick={handleUpdate}
              className="ml-2 bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition duration-300"
            >
              Update Content
            </button>
            <button
              onClick={handleCancel}
              className="ml-2 bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition duration-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourseContent;
