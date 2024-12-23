'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
    try {
        const { fullName, email, password, role, preferenceList } = await req.json();
        
        const response = await axios.post('http://localhost:3001/api/v1/auth/register', {
            name: fullName,
            email,
            password,
            role,
            preferences: preferenceList, // hard coded for now
        });

        if (response.status === 201) {
            return NextResponse.json({ message: 'Registration successful!' });
        }

        return NextResponse.json({ error: 'Registration failed' }, { status: response.status });
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
