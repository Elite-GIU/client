"use server";

import { NextResponse } from "next/server";
import axios from "axios";

interface Params {
  course_id: string;
  module_id: string;
}

export async function POST(request: Request, context: { params: Params }) {
  try {
    const { course_id, module_id } = await context.params;
    if (!course_id || !module_id) {
      return NextResponse.json(
        { error: "Course ID and Module ID are required" },
        { status: 400 }
      );
    }

    const token = request.headers.get("Authorization");
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token is required" },
        { status: 401 }
      );
    }
    const body = await request.json();

    const response = await axios.post(
      `http://localhost:3001/api/v1/student/courses/${course_id}/modules/${module_id}/rate`,
      {
        rate: body.rate,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    if (response.status === 201) {
      return NextResponse.json(response.data);
    }
    return NextResponse.json(
      { error: "Failed to rate module" },
      { status: response.status }
    );
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
