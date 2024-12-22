"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, AlertCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
const CreateContent = () => {
  const router = useRouter();
  const params = useParams();
  const { course_id, module_id } = params;
  const [role, setRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        if (selectedFile.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
          };
          reader.readAsDataURL(selectedFile);
        } else {
          setPreviewUrl(null);
        }
      }
    },
    []
  );
  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setPreviewUrl(null);
  }, []);
  const validateInputs = () => {
    if (title.length < 3) {
      setErrorMessage("Title must be at least 3 characters long.");
      return false;
    }
    if (description.length < 10) {
      setErrorMessage("Description must be at least 10 characters long.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchRole = async () => {
      const token = Cookies.get("Token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/profile/role", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setRole(data.role);
          if (data.role !== "instructor") {
            router.push(`/dashboard/courses/${course_id}`);
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching role:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const token = Cookies.get("Token");

    // Form data to send along with the file
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

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
    else{
      setErrorMessage("Please upload an attachment. Accepted types: MP4 or PDF")
      return;
    }

    try {
      const response = await fetch(
        `/api/dashboard/instructor/course/${course_id}/module/${module_id}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const contentId = responseData.content._id;
        router.push(
          `/dashboard/courses/${course_id}/modules/${module_id}/content/${contentId}`
        );
        setErrorMessage(null);
      } else {
        console.log(response);
        const errorData = await response.json();
        console.log("Error message:", errorData);
        setErrorMessage(errorData.error || "Failed to update content.");
      }
    } catch (error) {
      console.error("Error updating content:", error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-6xl"
      >
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
          Create Content
        </h2>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center p-4 mb-6 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50"
            role="alert"
          >
            <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3" />
            <span className="sr-only">Error</span>
            <div>{errorMessage}</div>
          </motion.div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 text-lg"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 h-64 text-lg"
                  required
                />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="file"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition duration-200 h-64">
                  {file ? (
                    <div className="space-y-2 text-center flex flex-col items-center justify-center">
                      {previewUrl ? (
                        <div className="relative w-40 h-40">
                          <Image
                            src={previewUrl}
                            alt="File preview"
                            layout="fill"
                            objectFit="contain"
                            className="rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="bg-gray-100 rounded-md p-4">
                          <p className="text-sm text-gray-600">{file.name}</p>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 text-center flex flex-col items-center justify-center">
                      <Upload className="mx-auto h-16 w-16 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span className="text-lg">Upload a file</span>
                          <input
                            id="file"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1 text-lg">or drag and drop</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        PDF, MP4 up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 text-xl text-white font-semibold rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200"
              >
                Submit
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateContent;
