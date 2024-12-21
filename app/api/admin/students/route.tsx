'use server'

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const page = Number(url.searchParams.get('page')) || 1; // Default to page 1 if not provided
        const limit = Number(url.searchParams.get('limit')) || 2; // Default to 10 items per page if not provided
        const name = url.searchParams.get('name');
        console.log("page "+page)
        const params: any = { page, limit };
        if (name) params.name = name;

        const token = req.headers.get('Authorization')
        if (!token) {
            return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 })
        }

        const response = await axios.get('http://localhost:3001/api/v1/admin/students', {
            headers: { Authorization: token },
            params: { name, page, limit }
        }
        );

        if (response.status === 200) {
            const data = response.data;
            return NextResponse.json({
                students: data.students, // List of courses
                totalPages: data.pagination.totalPages, // Total pages in the response
                currentPage: data.pagination.currentPage
            });
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