'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';
import React from 'react';
import { Params } from 'next/dist/server/request/params';

export async function DELETE(req: Request, context: { params: Promise<Params>}) {
    try {
        
        const {student_id} = await context.params;
        
        if (!student_id) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }
        const token = req.headers.get('Authorization');


        const response = await axios.delete(`http://localhost:3001/api/v1/student/${student_id}`, {
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