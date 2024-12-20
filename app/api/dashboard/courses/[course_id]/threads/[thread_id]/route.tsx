'use server'

import { NextResponse } from 'next/server'
import axios from "axios";

interface Params {
    course_id: string;
    thread_id: string;
}

export async function GET(req: Request, context: { params: Params }) {
    try {
        const { course_id, thread_id } = await context.params;

        if (!course_id || !thread_id) {
            return NextResponse.json({ error: "Course ID and Thread ID are required" }, { status: 400 });
        }

        const token = req.headers.get("Authorization");
        if (!token) {
            return NextResponse.json({ error: "Authorization token is required" }, { status: 401 });
        }

        const response = await axios.get(
            `http://localhost:3001/api/v1/chat/forums/courses/${course_id}/threads/${thread_id}`,
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

        return NextResponse.json({ error: "Failed to fetch thread" }, { status: response.status });
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data.message || "Server error" }, { status: error.response.status });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function PUT(req: Request, context: { params: Params }) {
    try {
        const { course_id, thread_id } = await context.params;
        const { title, description } = await req.json();
        console.log(title, description);
        if (!course_id || !thread_id) {
            return NextResponse.json({ error: "Course ID and Thread ID are required" }, { status: 400 });
        }

        const token = req.headers.get("Authorization");
        if (!token) {
            return NextResponse.json({ error: "Authorization token is required" }, { status: 401 });
        }

        const response = await axios.put(
            `http://localhost:3001/api/v1/chat/forums/courses/${course_id}/threads/${thread_id}`,
            { title, description },
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

        return NextResponse.json({ error: "Failed to update thread" }, { status: response.status });
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data.message || "Server error" }, { status: error.response.status });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, context: { params: Params }) {
    try {
        const { course_id, thread_id } = await context.params;

        if (!course_id || !thread_id) {
            return NextResponse.json({ error: "Course ID and Thread ID are required" }, { status: 400 });
        }

        const token = req.headers.get("Authorization");
        if (!token) {
            return NextResponse.json({ error: "Authorization token is required" }, { status: 401 });
        }

        const response = await axios.delete(
            `http://localhost:3001/api/v1/chat/forums/courses/${course_id}/threads/${thread_id}`,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(response);

        if (response.status === 200) {
            return NextResponse.json({ message: "Thread deleted successfully" });
        }

        return NextResponse.json({ error: "Failed to delete thread" }, { status: response.status });
    } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data.message || "Server error" }, { status: error.response.status });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}