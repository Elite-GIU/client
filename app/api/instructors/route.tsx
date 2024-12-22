'use server'

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const page = Number(url.searchParams.get('page')) || 1; // Default to page 1 if not provided
        const limit = Number(url.searchParams.get('limit')) || 10; // Default to 10 items per page if not provided
        const name = url.searchParams.get('name'); // Get the name parameter if provided

        const params: any = { page, limit };
        if (name) {
            params.name = name;
        }

        const response = await axios.get('http://localhost:3001/api/v1/instructor', { params });

        if (response.status === 200) {
            const data = response.data;
            return NextResponse.json({
                instructors: data.instructors, // Correct key
                pagination: {
                    currentPage: data.pagination.currentPage, 
                    totalPages: data.pagination.totalPages
                }
            });            
        }
        return NextResponse.json({ error: 'Failed to retrieve instructor data' }, { status: response.status });
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