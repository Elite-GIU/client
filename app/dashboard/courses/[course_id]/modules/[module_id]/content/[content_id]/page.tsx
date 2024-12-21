"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import StudentCourseContent from "@/app/components/dashboard/student/courses/modules/StudentCourseContent";
import { useParams } from "next/navigation";

const ContentPage = () => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const course_id = params.course_id;
  const module_id = params.module_id;
  const content_id = params.content_id;

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
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (role === "student") {
    return (
      <div>
        <StudentCourseContent
          course_id={course_id}
          module_id={module_id}
          content_id={content_id}
        />
      </div>
    );
  }

  if (role === "instructor") {
    return (
      <div>
        <h1 className="text-3xl font-semibold mb-6">Instructor Dashboard</h1>
        <div>TODO: Implement instructor content functionality</div>
      </div>
    );
  }

  return null;
};

export default ContentPage;
