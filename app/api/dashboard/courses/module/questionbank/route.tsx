'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const course_id = url.searchParams.get('course_id');
        const module_id = url.searchParams.get('module_id');
        
        if (!course_id || !module_id) {
            return NextResponse.json(
                { error: 'Course ID and Module ID are required' },
                { status: 400 }
            );
        }

        const token = req.headers.get('Authorization');
        if (!token) {
            return NextResponse.json(
                { error: 'Authorization token is required' },
                { status: 401 }
            );
        }

        const response = await axios.get(
            `http://localhost:3001/api/v1/question/${course_id}/modules/${module_id}/questionbank`,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status === 200) {
            return NextResponse.json(response.data);
        }

        return NextResponse.json(
            { error: 'Failed to fetch questions' },
            { status: response.status }
        );
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                { error: error.response.data.message.message || 'Server error' },
                { status: error.response.status }
            );
        }
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}