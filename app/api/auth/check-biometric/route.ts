'use server'

import { NextResponse } from 'next/server';
import axios from 'axios';

// Define the handler function for POST requests
export async function POST(req: Request) {
    try {

        const { email, browserFingerprint } = await req.json();
        const response = await axios.post('http://localhost:3001/api/v1/auth/check-biometric-auth', {email,browserFingerprint});
        if (response.status === 201) {
            const data = response.data;
            if (data.isRegistered) {
                return NextResponse.json({ isRegistered: true });
            } else {
                return NextResponse.json({ isRegistered: false });
            }
        }
        return NextResponse.json({ error: 'Biometric authentication check failed' }, { status: response.status });


    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (axios.isAxiosError(error) && error.response) {
                return NextResponse.json(
                    { error: error.response.data.message.message || 'Server error' },
                    { status: error.response.status }
                );
            }
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    }
} 

