'use server';

import { NextResponse } from "next/server";
import axios from 'axios';

interface Params {
    course_id: string;
    module_id: string;
}

export async function PUT(req: Request, context: { params: Params }) {
    try {
        const token = req.headers.get('Authorization');
        if (!token) {
            return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
        }

        const { course_id, module_id } = await context.params;
        const body = await req.json();

        const { title, assessmentType, numberOfQuestions, passingGrade  } = body;

        const response = await axios.put(
            `http://localhost:3001/api/v1/instructor/courses/${course_id}/modules/${module_id}`, 
            { title, assessmentType, numberOfQuestions, passingGrade },
            {
                headers: {
                    Authorization: token,
                },
            }
        );

        if (response.status === 200) {
            return NextResponse.json(response.data);
        }

        return NextResponse.json({ error: 'Failed to update module' }, { status: response.status });
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

export async function DELETE(req: Request, context: { params: Params }) {
    try {
        const token = req.headers.get('Authorization');
        if (!token) {
            return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
        }

        const { course_id, module_id } = await context.params;

        const response = await axios.delete(
            `http://localhost:3001/api/v1/instructor/courses/${course_id}/modules/${module_id}`,
            {
                headers: {
                    Authorization: token,
                },
            }
        );

        if (response.status === 200) {
            return NextResponse.json(response.data);
        }

        return NextResponse.json({ error: 'Failed to delete module' }, { status: response.status });
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