'use server'

import { NextResponse } from 'next/server';
import axios from 'axios';

interface Params {
    course_id: string;
    module_id: string;
    question_id: string;
}

export async function PUT(req: Request, context: { params: Params }) {
    try {
        const { course_id, module_id, question_id } = await context.params;
        const { question, choices, right_choice, difficulty, type } = await req.json();
        if (!course_id || !module_id || !question_id) {
            return NextResponse.json(
                { message: 'Course ID, Module ID, and Question ID are required' },
                { status: 400 }
            );
        }

        const token = req.headers.get('Authorization');
        if (!token) {
            return NextResponse.json({ error: "Authorization token is required" }, { status: 401 });
        }

        const response = await axios.put(
            `http://localhost:3001/api/v1/question/${course_id}/modules/${module_id}/question/${question_id}`,
            { question, choices, right_choice, difficulty, type },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status === 200) {
            return NextResponse.json(response.data.data);
        }

        return NextResponse.json({ error: "Failed to update question" }, { status: response.status });
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data.message || "Server error" }, { status: error.response.status });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, context: { params: Params }) {
    try {
        const { course_id, module_id, question_id } = await context.params;

        if (!course_id || !module_id || !question_id) {
            return NextResponse.json({ error: "Course ID and Module ID and Question ID are required" }, { status: 400 });
        }

        const token = req.headers.get("Authorization");
        if (!token) {
            return NextResponse.json({ error: "Authorization token is required" }, { status: 401 });
        }

        const response = await axios.delete(
            `http://localhost:3001/api/v1/question/${course_id}/modules/${module_id}/question/${question_id}`,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status === 200) {
            return NextResponse.json({ message: "Question deleted successfully" });
        }

        return NextResponse.json({ error: "Failed to delete question" }, { status: response.status });
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data.message || "Server error" }, { status: error.response.status });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}