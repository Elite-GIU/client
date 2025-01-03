'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import CourseSidebar from '../components/dashboard/student/courses/CoursesSidebar';
import { FaHome, FaBook, FaQuestionCircle, FaUserAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';
import Loading from '../loading';
import { SidebarProvider } from '../components/dashboard/student/courses/SidebarContext';

const studentSidebarItems = [
  { name: 'Dashboard', icon: <FaHome />, href: "/dashboard" },
  { name: 'My Courses', icon: <FaBook />, href: "/dashboard/courses" },
  { name: 'Quizzes', icon: <FaQuestionCircle />, href: "/dashboard/quizzes" },
  { name: 'Profile', icon: <FaUserAlt />, href: "/dashboard/profile" }
];

const instructorSidebarItems = [
  { name: 'Dashboard', icon: <FaHome />, href: "/dashboard" },
  { name: 'Analytics', icon: <FaBook />, href: "/dashboard/analytics" },
  { name: 'My Courses', icon: <FaBook />, href: "/dashboard/courses" },
  { name: 'Profile', icon: <FaUserAlt />, href: "/dashboard/profile" }
];

const adminSidebarItems = [
  { name: 'All Courses', icon: <FaBook />, href: "/dashboard/admin/courses" },
  { name: 'All Students', icon: <FaUserAlt />, href: "/dashboard/admin/students" },
  { name: 'Logs', icon: <FaQuestionCircle />, href: "/dashboard/admin/logs" }
];

const Layout = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get('Token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchRole = async () => {
      try {
        let response;
        response = await fetch('/api/auth/get-active-session', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        const session = await response.json();
        if (session != token) {
          Cookies.remove('Token');
          router.push('/login');
          return;
        }
        response = await fetch('/api/profile/role', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setRole(data.role);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error("Failed to fetch role", error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchRole();
  }, [router]);

  if (isLoading) {
    return <Loading />;
  }

  // Determine if the current route is for course details
  const isCoursePage = pathname.includes('/dashboard/courses/') && !pathname.endsWith('/dashboard/courses');

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen">
        <DashboardHeader toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
        <div className="flex flex-1 overflow-hidden">
          {isCoursePage ? (
            <CourseSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          ) : (
            <DashboardSidebar
              items={
                role === 'instructor'
                  ? instructorSidebarItems
                  : role === 'admin'
                  ? adminSidebarItems
                  : studentSidebarItems
              }
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          )}
          <main className={`${isCoursePage ? 'lg:ml-96' : 'lg:ml-64'} flex-1 p-4 overflow-auto`}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
