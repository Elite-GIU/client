"use server";

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
    try {
        const token = req.headers.get('Authorization');
        if (!token) {
            return NextResponse.json(
                { error: 'Authorization token is required' },
                { status: 401 }
            );
        }

        const url = new URL(req.url);
        const status = url.searchParams.get('status');
        if (status && !['enrolled', 'completed', 'failed'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status filter' },
                { status: 400 }
            );
        }

        const response = await axios.get('http://localhost:3001/api/v1/student/courses', {
            headers: { Authorization: token },
            params: status ? { status } : null, // Pass status if it exists
        });

        if (response.status === 200) {
            return NextResponse.json(response.data);
        }
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: response.status }
        );
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                { error: error.response.data.message || 'Server error' },
                { status: error.response.status }
            );
        }
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
