
'use server';

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')
        const response = await axios.get('http://localhost:3001/api/v1/logs',{
            headers: { Authorization: token },
        });
        if (response.status === 200) {
            const data = response.data;
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: response.status });
    } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                { error: error.response.data.message || 'Server error' },
                { status: error.response.status }
            );
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await axios.post('http://localhost:3001/api/v1/logs', body, {
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.status === 200) {
            const data = response.data;
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Failed to post logs' }, { status: response.status });
    } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                { error: error.response.data.message || 'Server error' },
                { status: error.response.status }
            );
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}