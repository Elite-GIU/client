'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'

interface Module {
   title: string;
   nrOfQuestions: number;
   assessmentType: string;
   passingGrade: number;
   _id: string;
}

const InstructorCourse =  (props: any) => {

    const [course, setCourse] = useState<Array<Module>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        nrOfQuestions: 0,
        assessmentType: 'mcq',
        passingGrade: 50,
        courseId: props.id
    });
    const [updateData, setUpdateData] = useState({
        numberOfQuestions: 0,
        assessmentType: 'mcq',
        passingGrade: 50,
        courseId: props.id,
        moduleId: ''
    })

    const fetchCourse = async() => {

        try {
            
            const token = Cookies.get('Token');
            const response = await fetch(`/api/instructor/course/${props.id}`, {
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

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: any) => {
        
        e.preventDefault();

        try {

            const token = Cookies.get('Token');
            const response = await fetch('/api/instructor/course/module', {
                method: 'POST',
                headers: {Authorization: `Bearer ${token}`, 'ContentType': 'application/json'},
                body: JSON.stringify(formData)
            });

            if(response.ok){

                alert('Module added successfully! Refresh the page to see the result');

            }else {
                alert('Error submitting Form! Please try again')
            }
        }catch(error){

            console.error("Error: ", error);

        }
    }

    const handleUpdate = async (e: any) => {

        e.preventDefault();

        try {

            const token = Cookies.get('Token');
            const response = await fetch(`/api/instructor/course/module/${updateData.moduleId}`, {
                method: 'PUT',
                headers: {Authorization: `Bearer ${token}`, 'ContentType': 'application/json'},
                body: JSON.stringify(updateData)
            });

            if(response.ok){

                alert('Module updated successfully! Refresh the page to see the result');

            }else {
                alert('Error submitting Form! Please try again')
            }
        }catch(error){

            console.error("Error: ", error);

        }

    }
    
    const handleEditDataChange = async (e: any) => {
        const { name, value } = e.target;
        setUpdateData({ ...updateData, [name]: value });
    }

    const openEditMenu = async (module: Module) => {
        const {nrOfQuestions, passingGrade, assessmentType, _id} = module;
        if(module._id != updateData.moduleId)
            setShowEdit(true);
        else 
            setShowEdit(!showEdit);
        setShowForm(false);
        setUpdateData({...updateData, numberOfQuestions: nrOfQuestions, passingGrade, assessmentType, moduleId: _id});
    }

    return (
        <>
        {course.length === 0 ? (
            <div className="text-center text-gray-500 text-sm">
              No module found. Start by uploading a module!
            </div>
          ) : (
            <div style={{alignContent: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {course.map((module) => (
                    <div
                    key={module.title}
                    className="border border-gray-200 rounded-lg shadow-md"
                    >
                    <div className="p-4">
                        <h3 className="text-lg font-medium mt-2 text-black">
                        {module.title}
                        </h3>
                        {/* Truncate description to two lines */}
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                            Assessment Type: {module.assessmentType}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                            Number of questions: {module.nrOfQuestions}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                            Passing Grade: {module.passingGrade}
                        </p>
                        <a
                            className="text-blue-600 text-sm font-medium hover:underline"
                            style={{marginTop: '3rem'}} 
                            onClick={() => openEditMenu(module)}
                        >
                            edit
                        </a>
                    </div>
                    </div>
                ))}
                </div>
                <a 
                    className="text-blue-600 text-sm font-medium hover:underline"
                    style={{marginTop: '2rem'}}
                    onClick={() => {setShowForm(!showForm); setShowEdit(false)}}
                >
                    {showForm? "Hide" : "Add Module"}
                </a>
                {
                    showForm && 
                    (
                        <form
                            onSubmit={handleSubmit}
                            className="mt-4 p-4 border border-gray-300 rounded w-full max-w-md"
                            style={{ textAlign: 'left' }}
                        >
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-black"
                                required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Number of Questions</label>
                                <input
                                type="number"
                                name="nrOfQuestions"
                                value={formData.nrOfQuestions}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-black"
                                required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Assessment Type</label>
                                <input
                                type="text"
                                name="assessmentType"
                                value={formData.assessmentType}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-black"
                                required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Passing Grade</label>
                                <input
                                type="number"
                                name="passingGrade"
                                value={formData.passingGrade}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-black"
                                required
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-600 text-white font-medium py-1 px-4 rounded hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </form>
                    )
                }
                {
                    showEdit && 
                    (
                        <form
                            onSubmit={handleUpdate}
                            className="mt-4 p-4 border border-gray-300 rounded w-full max-w-md"
                            style={{ textAlign: 'left' }}
                        >
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Number of Questions</label>
                                <input
                                type="number"
                                name="numberOfQuestions"
                                value={updateData.numberOfQuestions}
                                onChange={handleEditDataChange}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-black"
                                required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Assessment Type</label>
                                <input
                                type="text"
                                name="assessmentType"
                                value={updateData.assessmentType}
                                onChange={handleEditDataChange}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-black"
                                required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Passing Grade</label>
                                <input
                                type="number"
                                name="passingGrade"
                                value={updateData.passingGrade}
                                onChange={handleEditDataChange}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-black"
                                required
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-600 text-white font-medium py-1 px-4 rounded hover:bg-blue-700"
                            >
                                Update
                            </button>
                        </form>
                    )
                }
            </div>
          )}
        </>
    );
}

export default InstructorCourse;