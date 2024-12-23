'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';

interface Params {
  course_id: string;
}

export async function GET(req: Request, context: { params: Promise<Params>}) {
  try {
    const {course_id} = await context.params;
    if (!course_id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const token = req.headers.get('Authorization');

    if (!token) {
      return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    // Make the get request to the external API
    const response = await axios.get(
      `http://localhost:3001/api/v1/instructor/courses/${course_id}/modules?sortOrder=asc`, 
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status === 200) {
      return NextResponse.json(response.data);
    }

    return NextResponse.json({ error: 'Failed to fetch course' }, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: error.response.data.message || 'Server error' },
        { status: error.response.status }
      );
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request, context: { params: Promise<Params> }) {
  try {
    const {course_id} = await context.params;      
    if (!course_id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const token = req.headers.get('Authorization');

    if (!token) {
      return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    const body = await req.json();
      delete body._id;

      const response = await axios.post(
          `http://localhost:3001/api/v1/instructor/courses/${course_id}/modules`,
          body,
          {
              headers: {
                  Authorization: token,
                  "Content-Type": "application/json",
              },
          }
      );
      if (response.status === 201) {
          return NextResponse.json(response.data);
      }

      return NextResponse.json(
          { error: "Failed to update course" },
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