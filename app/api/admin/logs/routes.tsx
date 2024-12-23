'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const page = Number(url.searchParams.get('page')) || 1; // Default to page 1 if not provided
        const limit = Number(url.searchParams.get('limit')) || 10; // Default to 10 items per page if not provided
        const level = url.searchParams.get('level'); // Optional log level filter
        const startDate = url.searchParams.get('startDate'); // Optional start date filter
        const endDate = url.searchParams.get('endDate'); // Optional end date filter

        const params: any = { page, limit };
        if (level) params.level = level;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await axios.get('http://localhost:3001/api/v1/logs', { params });

        if (response.status === 200) {
            const data = response.data;
            return NextResponse.json({
                logs: data.logs, // List of logs
                totalPages: data.pagination.totalPages, // Total pages in the response
                currentPage: data.pagination.currentPage, // Current page number
            });
        }

        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: response.status });
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
