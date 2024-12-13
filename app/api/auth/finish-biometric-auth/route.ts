'use server'

import { NextResponse } from "next/server"
import axios from "axios"

// Define the handler function for POST requests
export async function POST(req: Request) {
    try {
        const { email, assertion } = await req.json()
        const response = await axios.post("http://localhost:3001/api/v1/auth/verify-authentication", { email, ...assertion})
        if (response.status === 200) {
            const data = response.data
            if (data.verified)  {
                const setCookieHeader = response.headers['set-cookie'];
                const res = NextResponse.json({ verified: true });
                if (setCookieHeader) {
                    res.headers.set('Set-Cookie', setCookieHeader[0]);
                }
                return res;
            } else {
                return NextResponse.json({ verified: false })
            }
        }
        return NextResponse.json({ error: "Biometric authentication check failed" }, { status: response.status })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (axios.isAxiosError(error) && error.response) {
                return NextResponse.json(
                    { error: error.response.data.message.message || "Server error" },
                    { status: error.response.status }
                )
            }
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
        }
    }
}