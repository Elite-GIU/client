"use server";

import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  try {

    // Extract the authorization token from headers
    const token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token is required" },
        { status: 401 }
      );
    }

    // Make the GET request to the backend service to fetch course threads
    const response = await axios.get(
      `http://localhost:3001/api/v1/notification/getNotifications`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
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
