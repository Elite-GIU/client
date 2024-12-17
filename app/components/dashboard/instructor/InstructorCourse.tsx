'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'


const InstructorCourse =  (props: any) => {

    const [course, setCourse] = useState<Array<any>>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourse = async() => {

        try {
            
            const token = Cookies.get('Token');
            const response = await fetch(`/api/dashboard/instructor/course/${props.id}`, {
                method: 'GET',
                headers: {Authorization: `Bearer ${token}`}
            });

            if(!response.ok)
                throw new Error('Failed to fetch course');

            const jsoned = await response.json()

            setCourse(jsoned);

        }catch(error){
            setError((error as Error).message);
        }finally{
            setIsLoading(false);
        }
    }  

    useEffect(() => {
        const effect = async () => {
            await fetchCourse();
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
                <ul>{course && <h3>success</h3>}</ul>
            }
        </div>
    );
}

export default InstructorCourse;