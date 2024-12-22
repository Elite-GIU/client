'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';
import React from 'react';
import { Params } from 'next/dist/server/request/params';


export async function PUT(req: Request, context: { params: Promise<Params>}) {
    console.log('route start'); 
    try {
        const token = req.headers.get("Authorization");
        console.log('token in route '+ token)
        if (!token) {
            return NextResponse.json(
                { error: "Authorization token is required" },
                { status: 401 }
            );
        }
        console.log('before id:'); 

        const { id } = await context.params;
        console.log('Received id:', id); 
        if (!id) {
            return NextResponse.json(
                { error: "Course ID is required" },
                { status: 400 }
            );
        }
        const body = await req.json();
        // Validation (optional but recommended for better control)
        /*
        if (!body.category || !body.description || !body.title || !body.keywords || !Array.isArray(body.keywords)) {
            return NextResponse.json(
                { error: "Invalid or missing request body fields" },
                { status: 400 }
            );
        }*/
  
        // Adjust fields if necessary (e.g., parsing difficulty_level as a number)
        body.difficulty_level = Number(body.difficulty_level);
  
        const response = await axios.put(
            `http://localhost:3001/api/v1/instructor/courses/${id}`,
            body,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );
  
        if (response.status === 200) {
            return NextResponse.json(response.data);
        }
  
        return NextResponse.json(
            { error: "Failed to update course" },
            { status: response.status }
        );
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                { error: error.response.data.message || "Server error" },
                { status: error.response.status }
            );
        }
  
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
  }