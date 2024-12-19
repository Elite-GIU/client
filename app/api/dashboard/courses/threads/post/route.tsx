"use server";

import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    console.log("ok 0");
    // Extract course ID from the URL parameters
    const url = new URL(req.url);
    const course_id = url.searchParams.get("course_id");
    const { title, content } = await req.json();
    console.log('test url' + url);
    console.log('test req' + req);
    console.log('test course' + course_id);
    console.log('test title' + title);
    console.log('test content' + content);
    if (!course_id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Extract the authorization token from headers
    const token = req.headers.get("Authorization");
    console.log("ok 1" + token);
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token is required" },
        { status: 401 }
      );
    }

    // Make the GET request to the backend service to fetch course threads
    console.log("ok 911");
    console.log(content);
    const response = await axios.post(
      `http://localhost:3001/api/v1/chat/forums/courses/${course_id}`,
      {
        title: title,
        description: content,
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response:", response);
    if (response.status === 201) {
      // Respond with the fetched threads
      return NextResponse.json(response.data);
    }

    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: response.status }
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle Axios-specific errors
      return NextResponse.json(
        { error: error.response.data.message || "Server error" },
        { status: error.response.status }
      );
    }

    // Handle generic errors
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
