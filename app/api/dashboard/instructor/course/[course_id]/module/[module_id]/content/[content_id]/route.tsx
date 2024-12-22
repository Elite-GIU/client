"use server";

import { NextResponse } from "next/server";
import axios from "axios";
import { error } from "console";

interface Params {
  course_id: string;
  module_id: string;
  content_id: string;
}

export async function GET(req: Request, context: { params: Params }) {
  try {
    const { course_id, module_id, content_id } = await context.params;

    if (!course_id || !module_id || !content_id) {
      return NextResponse.json(
        { error: "Course ID and Module ID and Content ID are required" },
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

    const response = await axios.get(
      `http://localhost:3001/api/v1/instructor/courses/${course_id}/modules/${module_id}/content/${content_id}`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return NextResponse.json(response.data);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: error.response.data.message || "Server error" },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: { params: Params }) {
  try {
    const { course_id, module_id, content_id } = await context.params;

    if (!course_id || !module_id || !content_id) {
      return NextResponse.json(
        { error: "Course ID, Module ID, and Content ID are required" },
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
      `http://localhost:3001/api/v1/instructor/courses/${course_id}/modules/${module_id}/content/${content_id}`,
      {
        method: "PUT",
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
