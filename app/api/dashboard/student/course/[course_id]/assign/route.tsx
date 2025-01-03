'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';

interface Params {
  course_id: string;
}

export async function POST(req: Request, context: { params: Params }) {
  try {

    console.log('POST /api/dashboard/student/course/[course_id]/assign');
    const { course_id } = await context.params;

    if (!course_id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const token = req.headers.get('Authorization');
    if (!token) {
      return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    // Make the POST request to the external API
    const response = await axios.post(
      `http://localhost:3001/api/v1/student/courses/${course_id}/assign`,
      {}, 
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('POST /api/dashboard/student/course/[course_id]/assign response', response);

    if (response.status === 201) {
      return NextResponse.json({ message: 'Successfully enrolled in the course' });
    }

    return NextResponse.json({ error: 'Failed to enroll in the course' }, { status: response.status });
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
