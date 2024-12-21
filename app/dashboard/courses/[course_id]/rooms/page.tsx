'use client'


import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Params } from 'next/dist/server/request/params';
import StudentCourse from '@/app/components/dashboard/student/StudentCourse';
import AllRooms from '../../../../components/dashboard/rooms/AllRooms';

const RoomsPage = (context : { params: Promise<Params>}) => {
    const [courseId, setCourseId] = useState<any>("");

    useEffect(() => {
        async function awaitParams() {
            const { course_id } = await context.params;
            setCourseId(course_id);
        }
        awaitParams();
    }, []);
    

    if (!courseId || typeof courseId !== 'string') {
        return <p>Loading...</p>; 
    }

    return (
        <div>
            <AllRooms courseId={courseId} />
        </div>
    );
};

export default RoomsPage;
