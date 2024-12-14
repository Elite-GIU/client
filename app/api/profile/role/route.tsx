'use server'

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
    try {
        const token = req.headers.get('Authorization');
        const response = await axios.get('http://localhost:3001/api/v1/users/', {
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