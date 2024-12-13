'use server'

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const response = await axios.post('http://localhost:3001/api/v1/auth/login', { email, password });
        if (response.status === 201) {
            
            const setCookieHeader = response.headers['set-cookie'];

            const res = NextResponse.json({ message: 'Login successful' });
            if (setCookieHeader) {
                res.headers.set('Set-Cookie', setCookieHeader[0]);
            }
            return res;
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
