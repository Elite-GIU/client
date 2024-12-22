"use server";

import { NextResponse } from "next/server";
import axios from "axios";

interface Params {
  course_id: string
}

export async function POST(request: Request, context: { params: Params }) {
  try {
    const { course_id} = await context.params;
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
    console.log(body);
    let response;
    if (body.course_id){
     response = await axios.post(
      `http://localhost:3001/api/v1/student/courses/${course_id}/rate`,
      {
        course_id: body.course_id
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );}
    else{
         response = await axios.post(
            `http://localhost:3001/api/v1/student/courses/${course_id}/rate`,
            {
              instructor_id: body.instructor_id
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          );
    }
    if (response.status === 201) {
      return NextResponse.json(response.data);
    }
    return NextResponse.json(
      { error: "Failed to rate module" },
      { status: response.status }
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
        console.log(error.cause)
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