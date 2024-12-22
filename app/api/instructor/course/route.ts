'use server';

import { NextResponse } from "next/server";
import axios from 'axios';

export async function GET(req: Request){
    
    try{

        const token = req.headers.get('Authorization');

        if(!token)
            return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });

        const response = await axios.get(`http://localhost:3001/api/v1/instuctor/courses`, {headers: {Authorization: token}});

        if(response.status === 200)
            return NextResponse.json(response.data);

        return NextResponse.json({ error: 'Authentication failed' }, { status: response.status });

    }catch(error){

        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                { error: error.response.data.message.message || 'Server error' },
                { status: error.response.status }
            );
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

    }
}

export async function POST(req: Request) {
    try {
        const token = req.headers.get("Authorization");  
        if (!token) {
            return NextResponse.json(
                { error: "Authorization token is required" },
                { status: 401 }
            );
        }
  
        const body = await req.json();  
        delete body._id
        body.difficulty_level = Number(body.difficulty_level);
        const response = await axios.post(
            "http://localhost:3001/api/v1/instructor/courses",
            body,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );
  
        if (response.status === 201) {
            return NextResponse.json(response.data);
        }
  
        return NextResponse.json(
            { error: "Failed to create course" },
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