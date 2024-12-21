'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const response = await axios.get(`http://localhost:3001/api/v1/users/instructor-name/${userId}`, {
            headers: {}
        });

        if (response.status === 200) {
            return NextResponse.json(response.data);
        }

        return NextResponse.json({ error: 'Authentication failed' }, { status: response.status });
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
