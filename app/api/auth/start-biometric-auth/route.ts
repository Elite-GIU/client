import { NextResponse } from "next/server"
import axios from "axios"

// Define the handler function for POST requests
export async function POST(req: Request) {
    try {
        const { email, browserFingerprint } = await req.json();
        
        // Request authentication options from your NestJS backend
        const response = await axios.post("http://localhost:3001/api/v1/auth/generate-authentication-options", { email, browserFingerprint });

        // Handle the successful response with authentication options
        if (response.status === 201) {
            return NextResponse.json(response.data);
        } else {
            // If the status code is not 200, consider it a failure and send back an error
            return NextResponse.json({ error: "Biometric authentication check failed" }, { status: response.status });
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Handle errors thrown by the Axios request to the NestJS backend
            return NextResponse.json(
                { error: error.response?.data.message || "Server error" },
                { status: error.response?.status || 500 }
            );
        }
        // General server error not related to Axios
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
