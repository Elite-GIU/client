'use server'

import { NextResponse } from 'next/server'
import axios from 'axios'

interface Params {
    course_id: string
    room_id: string
}

export async function GET(req: Request, context: { params: Params }) {
  try {
    const { course_id, room_id } = await context.params

    if (!course_id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    const token = req.headers.get('Authorization')
    if (!token) {
      return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 })
    }

    const response = await axios.get(
      `http://localhost:3001/api/v1/chat/study-room/courses/${course_id}/rooms/${room_id}`,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.status === 200) {
      return NextResponse.json(response.data.data)
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
    const { course_id, room_id } = await context.params

    if (!course_id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    const token = req.headers.get('Authorization')
    if (!token) {
      return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 })
    }

    const body = await req.json()
    const response = await axios.post(
      `http://localhost:3001/api/v1/chat/study-room/courses/${course_id}/rooms/${room_id}`,
      body,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.status === 201) {
      return NextResponse.json(response.data.data)
    }
    return NextResponse.json({ error: 'Failed to create message' }, { status: response.status })
  }
  catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json({ error: error.response.data.message || 'Server error' }, { status: error.response.status })
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}