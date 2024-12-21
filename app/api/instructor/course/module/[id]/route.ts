'use server';

import { NextResponse } from "next/server";
import axios from 'axios';
import { Params } from "next/dist/server/request/params";
export async function PUT(req: Request){

    try {
        const token = req.headers.get('Authorization');

        if (!token) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
        }

        const body = await req.json();

        const {courseId, moduleId} = body;

        delete body.courseId;
        delete body.moduleId;
        delete body.nrOfQuestions;

        body.numberOfQuestions = Number(body.numberOfQuestions);
        body.passingGrade = Number(body.passingGrade);


        const response = await axios.put(
            `http://localhost:3001/api/v1/instructor/courses/${courseId}/modules/${moduleId}`, body,
            {
            headers: {
                Authorization: token,
            },
            }
        );

        if (response.status === 200) {
            return NextResponse.json(response.data);
        }

        return NextResponse.json({ error: 'Failed to complete' }, { status: response.status });
    }catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          return NextResponse.json(
            { error: error.response.data.message || 'Server error' },
            { status: error.response.status }
          );
        }
    
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}