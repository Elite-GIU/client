'use server'

import { NextResponse } from 'next/server';
import axios from 'axios';
import { Params } from 'next/dist/server/request/params';

export async function GET(req: Request, context: { params: Params }) {
    try {
        const token = req.headers.get('Authorization');

        const response = await axios.get('http://localhost:3001/api/v1/dashboard/instructor/download', {
          headers: {
            Authorization: token,
          },
          responseType: 'arraybuffer',
        });

        if (response.status === 200) {
          const buffer = response.data;

          return new NextResponse(buffer, {
            headers: {
              'Content-Disposition': 'attachment; filename=InstructorReport.xlsx',
              'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
          });
        }

        return new NextResponse('Error generating report', { status: 500 });
    
      } catch (error) {
        console.error('Error fetching data from external API:', error);
        return new NextResponse('Error fetching data from external API', { status: 500 });
      }
}