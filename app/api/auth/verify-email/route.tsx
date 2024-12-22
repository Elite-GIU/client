'use server'
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    
    // Get the email and otp from the request body
    const { email, otp } = await request.json();
    console.log('email: ', email);
    console.log('otp: ', otp);
    const response = await fetch('http://localhost:3001/api/v1/auth/verify-email', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    console.log('response statis: ', response.status);

    if (response.ok) {
        return NextResponse.json({ message: 'Email verified successfully' });
      }
    console.log('response1: ', response);
    return NextResponse.json(
      { error: 'Email verification failed' },
      { status: response.status }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 400 }
    );
  }
}
