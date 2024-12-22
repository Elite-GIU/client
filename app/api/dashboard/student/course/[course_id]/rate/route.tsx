"use server";

import { NextResponse } from "next/server";
import axios from "axios";

interface Params {
  course_id: string;
}

export async function POST(request: Request, context: { params: Params }) {
  try {
    const { course_id } = await context.params;
    if (!course_id) {
      return NextResponse.json(
        { error: "Course ID is required" },
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

    if (!body.course_rate && !body.instructor_rate) {
      return NextResponse.json(
        { error: "At least one rating (course_rate or instructor_rate) is required" },
        { status: 400 }
      );
    }

    const payload: Record<string, number | undefined> = {
      course_rate: body.course_rate,
      instructor_rate: body.instructor_rate,
    };

    const response = await axios.post(
      `http://localhost:3001/api/v1/student/courses/${course_id}/rate`,
      payload,
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
      console.error("Axios Error:", error.response.data);
      return NextResponse.json(
        { error: error.response.data.message || "Server error" },
        { status: error.response.status }
      );
    }

    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
