import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { email, browserFingerprint, webAuthnResponse } = await req.json();
        
        const token = (await cookies()).get('Token')?.value;
        
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await axios.post(
            'http://localhost:3001/api/v1/auth/verify-registration',
            { email, browserFingerprint, ...webAuthnResponse },
            config
        );

        if (response.status === 200) {
            return new NextResponse(JSON.stringify(response.data), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        
        return new NextResponse(JSON.stringify({ error: 'Biometric authentication check failed' }), { status: 400 });

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.message || 'Server error';
            return new NextResponse(JSON.stringify({ error: message }), { status: status });
        }
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
