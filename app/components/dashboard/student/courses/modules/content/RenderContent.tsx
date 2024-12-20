import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const RenderContent: React.FC<{
  content: string;
  type: string;
  course_id: string;
  module_id: string;
  content_id: string;
}> = ({ content, type, course_id, module_id, content_id }) => {
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
          responseType: "blob", // Important for handling binary data
        }
      );

      // Create a URL for the Blob
      const fileURL = URL.createObjectURL(response.data);
      setFilePath(fileURL); // Set the file URL in state
    } catch (error) {
      console.error("Error fetching file:", error);
      setFilePath(null); // Handle the error appropriately
    }
  };

  useEffect(() => {
    fetchFile(); // Call fetchFile when component mounts
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

  if (type === "document" && filePath) {
    return (
      <div className=" items-center h-64">
        <iframe
          src={filePath}
          width="100%"
          height="600px"
          title="PDF Viewer"
          style={{ border: "none" }}
          className="w-full border-none mt-4"
        ></iframe>
      </div>
    );
  }

  return <div className="text-black">Error: Unsupported content type</div>;
};

export default RenderContent;
