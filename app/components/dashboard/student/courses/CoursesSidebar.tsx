import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { set } from 'date-fns';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface ModuleItem {
  id: string;
  name: string;
  href: string;
  contents?: ContentItem[];
  isLocked?: boolean;  // Indicates if the module is locked
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
  const [role , setRole] = useState<string | null>(null);
  useEffect(() => {
    async function fetchModules() {
      const token = Cookies.get('Token');
      if (!token) {
        router.push('/login');
        return;
      }

      const decodedToken: { role: string } = jwtDecode(token);
      const role = decodedToken.role;
      setRole(role);
      const response = await fetch(`/api/dashboard/${role}/course/${courseId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch modules');
      const data = await response.json();

      const fetchedModules = await Promise.all(data.modules.map(async (module: { _id: string; title: string; }) => {
        const moduleResponse = await fetch(`/api/dashboard/${role}/course/${courseId}/module/${module._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      
        if (moduleResponse.status === 403) {
          return {
            id: module._id,
            name: module.title,
            href: `/dashboard/courses/${courseId}/modules/${module._id}`,
            contents: [],
            isLocked: true
          };
        }
      
        const moduleData = await moduleResponse.json();
        if (!moduleData.module) {
          return {
            id: module._id,
            name: module.title,
            href: `/dashboard/courses/${courseId}/modules/${module._id}`,
            contents: [],
            isLocked: true
          };
        }
      
        console.log(moduleData.module.content);
        return {
          id: module._id,
          name: module.title,
          href: `/dashboard/courses/${courseId}/modules/${module._id}`,
          contents: moduleData.module.content ? moduleData.module.content.map((content: { _id: string; title: string; description: string; type: string; isVisible: boolean; }) => ({
            id: content._id,
            title: content.title,
            description: content.description,
            type: content.type,
            isVisible: content.isVisible
          })) : [],
          isLocked: false
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
    if (!modules.find(module => module.id === moduleId)?.isLocked) {
      setExpandedModules((prevState) => ({
        ...prevState,
        [moduleId]: !prevState[moduleId]
      }));
    }
  };

  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed h-full w-96 bg-white shadow-lg transition-transform duration-300 ease-in-out`}>
      <ul className="p-0 m-0">
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
                  className={`flex items-center cursor-pointer hover:bg-gray-200 bg-gray-200 w-full p-4 pl-6 ${module.isLocked ? 'opacity-50' : ''}`}
                  onClick={() => toggleExpansion(module.id)}
                >
                  <span className="ml-6 text-black flex-1">{module.name}</span>
                  {module.isLocked ? (
                    <FontAwesomeIcon icon={faLock} className="mr-2 text-black" />
                  ) : (
                    <span className="ml-auto text-black p-2 transition-transform">{expandedModules[module.id] ? '▼' : '▶'}</span>
                  )}
                </li>
                {expandedModules[module.id] && !module.isLocked && (
                  <ul>
                    {module.contents && module.contents.map((content) => (
                      <li
                        key={content.id}
                        className="pl-16 text-black p-4 hover:bg-gray-100 bg-gray-50 cursor-pointer"
                        onClick={() => handleNavigation(`/dashboard/courses/${courseId}/modules/${module.id}/content/${content.id}`)}
                      >
                        {content.title}
                      </li>
                    ))}
                    {role === 'instructor' ? (
                      <li
                        className="pl-16 p-4 text-black hover:bg-gray-100 bg-gray-50 cursor-pointer"
                        onClick={() => handleNavigation(`/dashboard/courses/${courseId}/modules/${module.id}/questionbank`)}
                      >
                        Question Bank
                      </li>
                    ) : (
                      <li
                        className="pl-16 p-4 text-black hover:bg-gray-100 bg-gray-50 cursor-pointer"
                        onClick={() => handleNavigation(`/dashboard/courses/${courseId}/modules/${module.id}/quiz`)}
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
          onClick={() => handleNavigation(`/dashboard/courses/${courseId}/threads`)}
        >
          <span className="ml-6 text-black">Threads</span>
        </li>

      </ul>
    </div>
  );
};

export default CourseSidebar;
