"use server";

import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const course_id = url.searchParams.get("course_id");
    const module_id = url.searchParams.get("module_id");
    const content_id = url.searchParams.get("content_id");
    if (!course_id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }
    if (!module_id) {
      return NextResponse.json(
        { error: "Module ID is required" },
        { status: 400 }
      );
    }
    if (!content_id) {
      return NextResponse.json(
        { error: "Content ID is required" },
        { status: 400 }
      );
    }
    const token = req.headers.get("Authorization");
    const response = await axios.get(
      `http://localhost:3001/api/v1/student/courses/${course_id}/modules/${module_id}/contents/${content_id}`,
      {
        headers: { Authorization: token },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: error.response.data.message.message || "Server error" },
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
