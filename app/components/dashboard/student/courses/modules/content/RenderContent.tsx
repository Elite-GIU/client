import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const RenderContent: React.FC<{
  content: string;
  course_id: string;
  module_id: string;
  content_id: string;
}> = ({ content, course_id, module_id, content_id }) => {
  const [filePath, setFilePath] = useState<string | null>(null);

  const fetchFile = async () => {
    try {
      const token = Cookies.get("Token");
      const response = await axios.get(
        `/api/dashboard/student/course/${course_id}/module/${module_id}/content/${content_id}/file`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const fileURL = URL.createObjectURL(response.data);
      setFilePath(fileURL);
    } catch (error) {
      setFilePath(null);
    }
  };

  useEffect(() => {
    fetchFile();
  }, [course_id, module_id, content_id]);

  if (!content) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-center text-gray-500">
          No content uploaded.
        </div>
      </div>
    );
  }

  const fileExtension = content.split(".").pop()?.toLowerCase();

  if (filePath) {
    switch (fileExtension) {
      case "pdf":
      case "doc":
      case "docx":
      case "ppt":
      case "pptx":
        return (
          <div className="flex justify-center items-center overflow-hidden h-full">
            <iframe
              src={filePath}
              title="Document Viewer"
              className="w-full h-full border-none rounded-lg"
            ></iframe>
          </div>
        );
      case "mp4":
      case "mov":
      case "avi":
        return (
          <div className="flex justify-center items-center overflow-hidden h-full">
            <video
              src={filePath}
              controls
              className="w-auto h-full border-none rounded-lg"
              style={{ objectFit: "contain", display: "block" }}
            />
          </div>
        );
      default:
        return <div className="text-black">Error: Unsupported file type</div>;
    }
  }

  return <div className="text-black">Error: File not found</div>;
};

export default RenderContent;
