"use server";

import { NextResponse } from "next/server";
import axios from "axios";

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

    const response = await axios.get(
      `http://localhost:3001/api/v1/student/courses/${course_id}/modules/${module_id}/content/${content_id}/download`,
      {
        headers: {
          Authorization: token,
        },
        responseType: "arraybuffer", // Important for binary data
      }
    );

    if (response.status === 200) {
      return new NextResponse(response.data, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="document.pdf"',
        },
      });
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
