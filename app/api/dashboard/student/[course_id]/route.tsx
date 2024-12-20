'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';
import React from 'react';
import { Params } from 'next/dist/server/request/params';

export async function GET(req: Request, context: { params: Promise<Params> }) {
  try {
    const { course_id } = await context.params;

    if (!course_id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const token = req.headers.get('Authorization');

    if (!token) {
      return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }
    console.log('Requesting course with ID:', course_id);
    console.log('Authorization token:', token);

    const apiUrl = `http://localhost:3001/api/v1/dashboard/student/courses/${course_id}`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: token,
      },
    });

    if (response.status === 200) {
      return NextResponse.json(response.data);
    }
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Axios error:', error.response);
      return NextResponse.json(
        { error: error.response.data.message || 'Server error' },
        { status: error.response.status }
      );
    }
    console.error('General error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
