'use server'

import { NextResponse } from 'next/server';
import axios from 'axios';

interface Params {
    course_id: string;
    module_id: string;
}

export async function GET(req: Request, context: { params: Params }) {
    try {
      const { course_id } = await context.params
      const { module_id } = await context.params
  
      if (!course_id) {
        return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
      }
      if (!module_id) {
        return NextResponse.json({ error: 'Module ID is required' }, { status: 400 })
      }
      const token = req.headers.get('Authorization')
      if (!token) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 })
      }
  
      const response = await axios.get(
        `http://localhost:3001/api/v1/question/${course_id}/modules/${module_id}/questionbank`,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        }
      )
  
      if (response.status === 200) {
        return NextResponse.json(response.data)
      }
  
      return NextResponse.json({ error: 'Failed to fetch threads' }, { status: response.status })
      
    }
    catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return NextResponse.json({ error: error.response.data.message || 'Server error' }, { status: error.response.status })
      }
  
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
    
  }

  export async function POST(req: Request, context: { params: Params }) {
    try {
      const { course_id, module_id } = await context.params
      const { question, choices, right_choice, difficulty, type } = await req.json()
      if (!course_id) {
        return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
      }
      if (!module_id) {
        return NextResponse.json({ error: 'Module ID is required' }, { status: 400 })
      }
      const token = req.headers.get('Authorization')
      if (!token) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 })
      }
  
      const response = await axios.post(
        `http://localhost:3001/api/v1/question/${course_id}/modules/${module_id}/questionbank`,
        { question, choices, right_choice, difficulty, type },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        }
      )
  
      if (response.status === 201) {
        return NextResponse.json(response.data)
      }
  
      return NextResponse.json({ error: 'Failed to create course' }, { status: response.status })
    }
    catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return NextResponse.json({ error: error.response.data.message || 'Server error' }, { status: error.response.status })
      }
  
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
    
  }

