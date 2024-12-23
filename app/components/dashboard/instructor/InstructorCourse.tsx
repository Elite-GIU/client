'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'; // Add useRouter for navigation
import { useSidebarUpdate } from '@/app/components/dashboard/student/courses/SidebarContext';
import { Pencil, Trash2, PlusCircle, ArrowLeft } from 'lucide-react';

interface Module {
  title: string;
  nrOfQuestions: number;
  assessmentType: string;
  passingGrade: number;
  _id: string;
}

const InstructorCourse = (props: any) => {
  const router = useRouter(); // Initialize router for back navigation
  const [course, setCourse] = useState<Array<Module>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    nrOfQuestions: 1,
    assessmentType: 'mcq',
    passingGrade: 50,
    courseId: props.id,
    moduleId: '',
  });

  const { triggerUpdate } = useSidebarUpdate();

  const fetchCourse = async () => {
    try {
      const token = Cookies.get('Token');
      const response = await axios.get(`/api/instructor/course/${props.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourse(response.data);
    } catch (error) {
      setError('Failed to fetch course modules.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'nrOfQuestions' || name === 'passingGrade' ? parseInt(value) + 0 : value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get('Token');
    try {
      if (isEdit) {
        // Edit module API call
        await axios.put(
          `/api/instructor/course/${formData.courseId}/module/${formData.moduleId}`,
          {
            title: formData.title,
            numberOfQuestions: formData.nrOfQuestions,
            assessmentType: formData.assessmentType,
            passingGrade: formData.passingGrade,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        setCourse((prev) =>
          prev.map((module) =>
            module._id === formData.moduleId ? { ...module, ...formData } : module
          )
        );
      } else {
        // Add new module API call
        const response = await axios.post(
          `/api/instructor/course/${formData.courseId}`,
          {
            title: formData.title,
            nrOfQuestions: formData.nrOfQuestions,
            assessmentType: formData.assessmentType,
            passingGrade: formData.passingGrade,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log('response', response.data);
        const newData = {
          title: response.data.newModule.title,
          nrOfQuestions: response.data.newModule.numberOfQuestions,
          assessmentType: response.data.newModule.assessmentType,
          passingGrade: response.data.newModule.passingGrade,
          _id: response.data.newModule._id,
        }
        setCourse((prev) => [...prev, newData]);
      }
      setShowModal(false);
      triggerUpdate();
    } catch (error) {
      alert('Failed to save module.');
    }
  };
  
  const handleEdit = (module: Module) => {
    setFormData({
      title: module.title,
      nrOfQuestions: module.nrOfQuestions,
      assessmentType: module.assessmentType,
      passingGrade: module.passingGrade,
      courseId: props.id,
      moduleId: module._id,
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (moduleId: string) => {
    const token = Cookies.get('Token');
    try {
      await axios.delete(`/api/instructor/course/${formData.courseId}/module/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourse((prev) => prev.filter((module) => module._id !== moduleId));
    triggerUpdate();
    } catch (error) {
      alert('Failed to delete module.');
    }
  };
  
  useEffect(() => {
    fetchCourse();
  }, []);

  if (isLoading) {
    return <div className="text-black">Loading...</div>;
  }

  if (error) {
    return <div className="text-black">{error}</div>;
  }

  return (
    <div className="p-8 space-y-6">
    <h1 className="text-2xl font-bold text-black">Manage Modules</h1>
    <div className="flex justify-between items-center">
        <button
        onClick={() => router.back()} 
        className="flex items-center text-black bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition"
        >
        <ArrowLeft className="mr-2 w-5 h-5" />
        Back
        </button>
        <button
        onClick={() => {
            setFormData({
            title: '',
            nrOfQuestions: 1,
            assessmentType: 'mcq',
            passingGrade: 50,
            courseId: props.id,
            moduleId: '',
            });
            setIsEdit(false);
            setShowModal(true);
        }}
        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
        <PlusCircle className="mr-2 w-5 h-5" />
        Add Module
        </button>
    </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {course.map((module, index) => (
        <div
          key={module._id || `module-${index}`} 
          className="bg-white shadow rounded-lg p-6 border border-gray-200 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-lg font-semibold text-black">{module.title}</h2>
            <p className="text-sm text-black">Assessment Type: {module.assessmentType}</p>
            <p className="text-sm text-black">Questions: {module.nrOfQuestions}</p>
            <p className="text-sm text-black">Passing Grade: {module.passingGrade}%</p>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={() => handleEdit(module)}
              className="text-blue-500 hover:underline"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDelete(module._id)}
              className="text-red-500 hover:underline"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-black">
                {isEdit ? 'Edit Module' : 'Add New Module'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✖
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">Module Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Assessment Type</label>
                <select
                  name="assessmentType"
                  value={formData.assessmentType}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="mcq">Multiple Choice</option>
                  <option value="true_false">True or False</option>
                  <option value="mix">Mix</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Number of Questions</label>
                <input
                  type="number"
                  name="nrOfQuestions"
                  value={formData.nrOfQuestions}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Passing Grade (%)</label>
                <input
                  type="number"
                  name="passingGrade"
                  value={formData.passingGrade}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorCourse;
