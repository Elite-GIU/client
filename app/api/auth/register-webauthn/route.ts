import { NextResponse } from "next/server";
import axios from 'axios';
import { cookies } from 'next/headers';

export async function POST(req : Request) {
    try {
        const { email, browserFingerprint } = await req.json();
        const token = (await cookies()).get('Token')?.value; 
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.post('http://localhost:3001/api/v1/auth/register-webauthn', {
            email,
            browserFingerprint
        }, config);

        if (response.status === 201) {
            return new NextResponse(JSON.stringify(response.data), { status: 201 });
        }

        return new NextResponse(JSON.stringify({ error: 'Failed to register for biometric authentication' }), { status: 400 });

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Server error';
            return new NextResponse(JSON.stringify({ error: errorMessage }), { status: error.response.status });
        }

        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
