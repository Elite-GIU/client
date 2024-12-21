'use server'

import { NextResponse } from 'next/server';
import axios from 'axios';

interface Params {
  course_id: string;
}

export async function GET(req: Request, context: { params: Params }) {
    try {
        const { course_id } = await context.params;
        if (!course_id) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        const token = req.headers.get('Authorization'); 
        if (!token) {
            return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
        }

        const response = await axios.get(
            `http://localhost:3001/api/v1/student/courses/${course_id}/modules`, 
            {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status === 200) {
            return NextResponse.json( response.data);
        }   

        
        
    } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 403) {
            console.log('error', error.response.data);
            return NextResponse.json({ status: 403 });
        }
        if (axios.isAxiosError(error) && error.response) {
            console.log('error', error.response.data);
            return NextResponse.json(
                { error: error.response.data.message || 'Server error' },
                { status: error.response.status }
            );
        }

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
