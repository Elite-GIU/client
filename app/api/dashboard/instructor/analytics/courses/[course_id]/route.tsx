'use server'

import { NextResponse } from 'next/server';
import axios from 'axios';
import { Params } from 'next/dist/server/request/params';

export async function GET(req: Request, context: { params: Params }) {
    try {

        const { course_id } = await context.params;

        if (!course_id) {
        return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        const token = req.headers.get('Authorization');

        if (!token) {
            return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
        }

        const response = await axios.get(`http://localhost:3001/api/v1/dashboard/instructor/course/${course_id}`, {
            headers: { Authorization: token }
        });
        if (response.status === 200) {
            return NextResponse.json(response.data);

        }
        return NextResponse.json({ error: 'Authentication failed' }, { status: response.status });
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                { error: error.response.data.message.message || 'Server error' },
                { status: error.response.status }
            );
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}