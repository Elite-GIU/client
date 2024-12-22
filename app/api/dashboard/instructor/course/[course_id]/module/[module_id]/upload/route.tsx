"use server";

import { NextResponse } from "next/server";
import axios from "axios";

interface Params {
  course_id: string;
  module_id: string;
}

export async function POST(req: Request, context: { params: Params }) {
  try {
    const { course_id, module_id } = await context.params;

    if (!course_id || !module_id) {
      return NextResponse.json(
        { error: "Course ID, and Module ID are required" },
        { status: 400 }
      );
    }

    const token = req.headers.get("Authorization");

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token is required" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const response = await fetch(
      `http://localhost:3001/api/v1/instructor/courses/${course_id}/modules/${module_id}/upload`,
      {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message.message || "Failed to update content." },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
