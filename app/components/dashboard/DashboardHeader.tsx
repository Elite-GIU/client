import React, { useState, useEffect } from "react";
import TutorFlowLogo from "../TutorFlowLogo";
import Link from "next/link";
import NotificationsPopup from "../NotificationsPopup";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  username?: string;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  username,
  toggleSidebar,
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<{ _id: string; title: string; message: string }[]>([]);

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
  };

  const router = useRouter();
  useEffect(() => {
    let interval: NodeJS.Timeout;
    try {
      const token = Cookies.get("Token");
      if (!token) {
        router.push("/login");
        return;
      }
      
      const fetchNotifications = async () => {
        const response = await fetch("/api/notifications", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          console.error("Failed to fetch notifications");
        }

        
      };
      fetchNotifications();
      interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);

    } catch (error) {
      console.error("Failed to fetch notification", error);
    }
  }, [router]);

  return (
    <header className="bg-white shadow-md h-16 flex justify-between items-center px-6">
      <button onClick={toggleSidebar} className="md:hidden">
        <svg
          className="h-8 w-8 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <Link href="/">
        <TutorFlowLogo />
      </Link>

      <div className="flex items-center space-x-4">
        {username && (
          <span className="hidden sm:block text-sm text-gray-800">
            {username}
          </span>
        )}

        {/* Bell Icon */}
        <div className="relative">
          <button
            aria-label="Notifications"
            onClick={toggleNotifications}
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2 2 0 0118 14V8a6 6 0 00-12 0v6a2 2 0 01-.595 1.405L4 17h5m4 0v2a2 2 0 01-4 0v-2m4 0H9"
              />
            </svg>
          </button>

          {/* Notifications Popup */}
          {isNotificationsOpen && (
            <NotificationsPopup
              closePopup={() => setIsNotificationsOpen(false)}
              notifications= {notifications.slice(0, 5)}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
