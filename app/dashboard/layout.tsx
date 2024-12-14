'use client'

import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import { FaHome, FaBook, FaQuestionCircle, FaUserAlt } from 'react-icons/fa';
import Cookies from 'js-cookie'; 
import Loading from '../loading';

const studentSidebarItems = [
  { name: 'Dashboard', icon: <FaHome />, href: "/dashboard" },
  { name: 'My Courses', icon: <FaBook />, href: "/dashboard/courses" },
  { name: 'Quizzes', icon: <FaQuestionCircle />, href: "/dashboard/quizzes" },
  { name: 'Profile', icon: <FaUserAlt />, href: "/dashboard/profile" }
];

const instructorSidebarItems = [
  { name: 'Dashboard', icon: <FaHome />, href: "/dashboard" },
  { name: 'Analytics', icon: <FaBook />, href: "/dashboard/analytics" },
  { name: 'Profile', icon: <FaUserAlt />, href: "/dashboard/profile" }
];

const Layout = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('Token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchRole = async () => {
      try {
        const response = await fetch('/api/profile/role', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
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

  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar items={role === 'instructor' ? instructorSidebarItems : studentSidebarItems} isOpen={isOpen} setIsOpen={setIsOpen} />
        <main className="flex-1 p-4 overflow-auto sm:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
