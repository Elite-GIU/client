'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface ModuleItem {
  id: string;
  name: string;
  href: string;
  contents?: ContentItem[];
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
  const courseId = pathname.split('/')[3];
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({});
  const [isModulesExpanded, setIsModulesExpanded] = useState(false);

  useEffect(() => {
    async function fetchModules() {
      const token = Cookies.get('Token');
      const response = await fetch(`/api/dashboard/student/course/${courseId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch modules');
      const data = await response.json();

      const fetchedModules = await Promise.all(data.modules.map(async (module: { _id: string; title: string; }) => {
        const moduleResponse = await fetch(`/api/dashboard/student/course/${courseId}/module/${module._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const moduleData = await moduleResponse.json();
        return {
          id: module._id,
          name: module.title,
          href: `/dashboard/courses/${courseId}/modules/${module._id}`,
          contents: moduleData.content.map((content: { _id: string; title: string; description: string; type: string; isVisible: boolean; }) => ({
            id: content._id,
            title: content.title,
            description: content.description,
            type: content.type,
            isVisible: content.isVisible
          }))
        };
      }));

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
    setExpandedModules((prevState) => ({
      ...prevState,
      [moduleId]: !prevState[moduleId]
    }));
  };

  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 fixed h-full w-96 bg-white shadow-lg transition-transform duration-300 ease-in-out`}>
      <ul className="p-0 m-0">
        {/* Modules Toggle */}
        <li
          className="flex items-center cursor-pointer hover:bg-gray-400 bg-gray-300 w-full p-4"
          onClick={toggleModules}
        >
          <span className="ml-6 text-black flex-1 font-bold">Modules</span>
          <span className="ml-auto text-black p-2 transition-transform">{isModulesExpanded ? '▼' : '▶'}</span>
        </li>

        {isModulesExpanded && (
          <ul>
            {modules.map((module) => (
              <React.Fragment key={module.id}>
                {/* Module Toggle */}
                <li
                  className="flex items-center cursor-pointer hover:bg-gray-200 bg-gray-200 w-full p-4 pl-6"
                  onClick={() => toggleExpansion(module.id)}
                >
                  <span className="ml-6 text-black flex-1">{module.name}</span>
                  <span className="ml-auto text-black p-2 transition-transform">{expandedModules[module.id] ? '▼' : '▶'}</span>
                </li>
                {expandedModules[module.id] && (
                  <ul>
                    {module.contents &&
                      module.contents.map((content) => (
                        <li
                          key={content.id}
                          className="pl-16 text-black p-4 hover:bg-gray-100 bg-gray-50 cursor-pointer"
                          onClick={() =>
                            handleNavigation(`/dashboard/courses/${courseId}/modules/${module.id}/content/${content.id}`)
                          }
                        >
                          {content.title}
                        </li>
                      ))}
                    <li
                      className="pl-16 p-4 text-black hover:bg-gray-100 bg-gray-50 cursor-pointer"
                      onClick={() =>
                        handleNavigation(`/dashboard/courses/${courseId}/modules/${module.id}/quiz`)
                      }
                    >
                      Quiz
                    </li>
                  </ul>
                )}
              </React.Fragment>
            ))}
            
          </ul>
        )}
        <li
          className="flex items-center cursor-pointer hover:bg-gray-300 bg-gray-200 w-full p-6 pl-4"
          onClick={() => handleNavigation(`/dashboard/courses/${courseId}/threads`)}
        >
          <span className="ml-6 text-black">Threads</span>
        </li>

      </ul>
    </div>
  );
};

export default CourseSidebar;