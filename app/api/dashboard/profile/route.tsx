'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
    try {
        const token = req.headers.get('Authorization');
        const response = await axios.get('http://localhost:3001/api/v1/users/my-profile', {
            headers: { Authorization: token }
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
export async function PUT(req: Request) {
    try {
        const token = req.headers.get('Authorization');
        const { name, preferences } = await req.json();

        const response = await axios.put(
            'http://localhost:3001/api/v1/users/my-profile',
            { name, preferences },
            {
                headers: { Authorization: token }
            }
        );

        if (response.status === 200) {
            return NextResponse.json(response.data);
        }
        return NextResponse.json({ error: 'Update failed' }, { status: response.status });
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
export async function DELETE(req: Request) {
    try {
        const token = req.headers.get('Authorization');

        const response = await axios.delete('http://localhost:3001/api/v1/student', {
            headers: { Authorization: token }
        });
        
        if (response.status === 200) {
            return NextResponse.json({ message: 'Profile deleted successfully' });
        }
        return NextResponse.json({ error: 'Deletion failed' }, { status: response.status });
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