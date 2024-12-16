'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'

interface Course {
    _id: string;
    title: string;
    category: string;
    difficulty_level: number; 
    image_path: string;
    instructor_id: string;
    instructor_name: string | null;
    description: string;
}

const MyCoursesComponentInstructor =  () => {

    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourses = async() => {

        try {
            
            const token = Cookies.get('Token');
            const response = await fetch(`/api/dashboard/instructor/course`, {
                method: 'GET',
                headers: {Authorization: `Bearer ${token}`}
            });

            if(!response.ok)
                throw new Error('Failed to fetch courses');

            const jsoned = await response.json()

            setCourses(jsoned);

        }catch(error){
            setError((error as Error).message);
        }finally{
            setIsLoading(false);
        }
    }  

    useEffect(() => {
        const effect = async () => {
            await fetchCourses();
        }
        effect();
    }, []);

    if (isLoading) {
        return <div className="text-black">Loading...</div>;
    }
    
    if (error) {
        return <div className="text-black">Error: {error}</div>;
    }

    return (
        <div>
            {
                <ul>{courses && courses.map((course: Course) => <h3 style={{color: 'black'}}>{course.instructor_id}</h3>)}</ul>
            }
        </div>
    );
}

export default MyCoursesComponentInstructor;