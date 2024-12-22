import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Eye, EyeOff } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface ModuleItem {
  id: string;
  name: string;
  href: string;
  contents?: ContentItem[];
  isLocked?: boolean;
}

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: string;
  isVisible: boolean;
}

const CourseSidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const courseId = pathname.split("/")[3];

  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [expandedModules, setExpandedModules] = useState<{
    [key: string]: boolean;
  }>({});
  const [isModulesExpanded, setIsModulesExpanded] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    async function fetchModules() {
      const token = Cookies.get("Token");
      if (!token) {
        router.push("/login");
        return;
      }

      const decodedToken: { role: string } = jwtDecode(token);
      const role = decodedToken.role;
      setRole(role);
      const response = await fetch(
        `/api/dashboard/${role}/course/${courseId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch modules");
      const data = await response.json();

      const fetchedModules = await Promise.all(
        data.modules.map(async (module: { _id: string; title: string }) => {
          const moduleResponse = await fetch(
            `/api/dashboard/${role}/course/${courseId}/module/${module._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (moduleResponse.status === 403) {
            return {
              id: module._id,
              name: module.title,
              href: `/dashboard/courses/${courseId}/modules/${module._id}`,
              contents: [],
              isLocked: true,
            };
          }

          const moduleData = await moduleResponse.json();
          if (!moduleData.module) {
            return {
              id: module._id,
              name: module.title,
              href: `/dashboard/courses/${courseId}/modules/${module._id}`,
              contents: [],
              isLocked: true,
            };
          }

          return {
            id: module._id,
            name: module.title,
            href: `/dashboard/courses/${courseId}/modules/${module._id}`,
            contents: moduleData.module.content
              ? moduleData.module.content.map(
                  (content: {
                    _id: string;
                    title: string;
                    description: string;
                    type: string;
                    isVisible: boolean;
                  }) => ({
                    id: content._id,
                    title: content.title,
                    description: content.description,
                    type: content.type,
                    isVisible: content.isVisible,
                  })
                )
              : [],
            isLocked: false,
          };
        })
      );

      setModules(fetchedModules);
    }

    fetchModules();
  }, [courseId]);

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  const toggleModules = () => {
    setIsModulesExpanded((prevState) => !prevState);
  };

  const toggleExpansion = (moduleId: string) => {
    if (!modules.find((module) => module.id === moduleId)?.isLocked) {
      setExpandedModules((prevState) => ({
        ...prevState,
        [moduleId]: !prevState[moduleId],
      }));
    }
  };

  const handleCreateContentClick = (moduleId: string) => {
    router.push(
      `/dashboard/courses/${courseId}/modules/${moduleId}/content/create`
    );
  };

  return (
    <div
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed h-full w-96 bg-white shadow-lg transition-transform duration-300 ease-in-out`}
    >
      <ul className="p-0 m-0">
        <li
          className="flex items-center cursor-pointer hover:bg-gray-400 bg-gray-300 w-full p-4"
          onClick={toggleModules}
        >
          <span className="ml-6 text-black flex-1 font-bold">Modules</span>
          <span className="ml-auto text-black p-2 transition-transform">
            {isModulesExpanded ? "▼" : "▶"}
          </span>
        </li>

        {isModulesExpanded && (
          <ul>
            {modules.map((module) => (
              <React.Fragment key={module.id}>
                {/* Module Toggle */}
                <li
                  className={`flex items-center cursor-pointer hover:bg-gray-200 bg-gray-200 w-full p-4 pl-6 ${
                    module.isLocked ? "opacity-50" : ""
                  }`}
                  onClick={() => toggleExpansion(module.id)}
                >
                  <span className="ml-6 text-black flex-1">{module.name}</span>
                  {module.isLocked ? (
                    <FontAwesomeIcon
                      icon={faLock}
                      className="mr-2 text-black"
                    />
                  ) : (
                    <span className="ml-auto text-black p-2 transition-transform">
                      {expandedModules[module.id] ? "▼" : "▶"}
                    </span>
                  )}
                </li>
                {expandedModules[module.id] && !module.isLocked && (
                  <ul>
                    {role === "instructor" && (
                      <li
                        onClick={() => handleCreateContentClick(module.id)}
                        className=" text-black py-4 hover:bg-gray-100 bg-gray-50 cursor-pointer text-center"
                      >
                        <FontAwesomeIcon icon={faPlus} /> Create Content
                      </li>
                    )}
                    {module.contents &&
                      module.contents.map((content) => (
                        <li
                          key={content.id}
                          className="pl-16 text-black p-4 hover:bg-gray-100 bg-gray-50 cursor-pointer"
                          onClick={() =>
                            handleNavigation(
                              `/dashboard/courses/${courseId}/modules/${module.id}/content/${content.id}`
                            )
                          }
                        >
                          <div className="flex items-center">
                            {role === "student" ? (
                              // If the role is student, only display the title without the eye icons
                              <span>{content.title}</span>
                            ) : (
                              // If the role is not student, show the eye icon based on visibility
                              content.isVisible ? (
                                <span className="flex items-center">
                                  <Eye className="text-green-500 mr-2" /> {/* Eye icon for visible */}
                                  {content.title}
                                </span>
                              ) : (
                                <span className="flex items-center text-gray-400">
                                  <EyeOff className="text-red-500 mr-2" /> {/* Eye-off icon for not visible */}
                                  {content.title}
                                </span>
                              )
                            )}
                          </div>

                        </li>
                      ))}

                    {role === "instructor" ? (
                      <li
                        className="pl-16 p-4 text-black font-bold hover:bg-gray-100 bg-gray-50 cursor-pointer"
                        onClick={() =>
                          handleNavigation(
                            `/dashboard/courses/${courseId}/modules/${module.id}/questionbank`
                          )
                        }
                      >
                        Question Bank
                      </li>
                    ) : (
                      <li
                        className="pl-16 p-4 text-black font-bold hover:bg-gray-100 bg-gray-50 cursor-pointer"
                        onClick={() =>
                          handleNavigation(
                            `/dashboard/courses/${courseId}/modules/${module.id}/quiz`
                          )
                        }
                      >
                        Quiz
                      </li>
                    )}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>
        )}
        <li
          className="flex items-center cursor-pointer hover:bg-gray-300 bg-gray-200 w-full p-6 pl-4"
          onClick={() =>
            handleNavigation(`/dashboard/courses/${courseId}/threads`)
          }
        >
          <span className="ml-6 text-black">Threads</span>
        </li>
        <li
          className="flex items-center cursor-pointer hover:bg-gray-300 bg-gray-200 w-full p-6 pl-4"
          onClick={() =>
            handleNavigation(`/dashboard/courses/${courseId}/rooms`)
          }
        >
          <span className="ml-6 text-black">Rooms</span>
        </li>
      </ul>
    </div>
  );
};

export default CourseSidebar;
