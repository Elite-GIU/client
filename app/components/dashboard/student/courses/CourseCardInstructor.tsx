import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiSave } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie'
import Select from 'react-select';

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    category: string;
    difficulty_level: number;
    image_path: string;
    instructor_id: string;
    instructor_name: string | null;
    description: string;
    keywords: string[]; // Adding keywords
  };
  onUpdate?: (updatedCourse: {
    _id: string;
    title: string;
    category: string;
    difficulty_level: number;
    image_path: string;
    description: string;
    keywords: string[];
  }) => void;
  onDelete?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(course.title);
  const [category, setCategory] = useState(course.category);
  const [difficultyLevel, setDifficultyLevel] = useState(course.difficulty_level);
  const [imagePath, setImagePath] = useState(course.image_path);
  const [description, setDescription] = useState(course.description);
  const [keywords, setKeywords] = useState(course.keywords.join(', ')); // Convert array to string for easy editing

  const pathname = usePathname();

  const handleSave = () => {
    const updatedCourse = {
      _id: course._id,
      title,
      category,
      difficulty_level: difficultyLevel,
      image_path: imagePath,
      description,
      keywords: keywords.split(',').map((keyword) => keyword.trim()), // Convert string back to array
    };

    if (onUpdate) {
      onUpdate(updatedCourse);
    }
    setIsEditing(false); // Exit edit mode after saving
  };


  const isCoursePage = pathname.endsWith('/courses');


   // Keywords options for Select dropdown
   const keywordOptions = [
    { value: 'AI', label: 'AI' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Machine Learning', label: 'Machine Learning' },
    { value: 'Databases', label: 'Databases' },
  ];

  return (
    
    <div className="bg-white text-black rounded-lg p-8 shadow border hover:shadow-lg transition-shadow duration-300">
     
      {/* Course Title and Timestamp */}
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-md p-2 w-full text-lg font-semibold text-black"
          />
        ) : (
          <Link href={`/dashboard/courses/${course._id}`}>
            <h3 className="font-semibold text-2xl text-black hover:text-blue-600 cursor-pointer">
              {course.title}
            </h3>
          </Link>
        )}
      </div>

      {/* Course Category and Difficulty Level */}
        <p className="text-sm text-gray-800 flex items-center gap-2">
        {isEditing ? (
    <>
        <label>
            Category:
            <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="ml-2 border rounded-md p-1"
                placeholder="Enter category"
            />
              </label>
              |
              <label>
                  Difficulty Level:
                  <select
                      value={difficultyLevel}
                      onChange={(e) => setDifficultyLevel(Number(e.target.value))}
                      className="ml-2 border rounded-md p-1"
                  >
                      <option value={1}>Beginner</option>
                      <option value={2}>Intermediate</option>
                      <option value={3}>Advanced</option>
                  </select>
              </label>
          </>
          ) : (
          <>
              <span>Category: {course.category}</span> | 
              <span
                  className={`ml-2 p-2 rounded-md font-semibold
                      ${course.difficulty_level === 1 ? 'bg-green-100 text-green-600 border-green-500' : 
                        course.difficulty_level === 2 ? 'bg-orange-100 text-orange-600 border-orange-500' : 
                        'bg-red-100 text-red-600 border-red-500'}`}
              >
                  {course.difficulty_level === 1 ? 'Beginner' :
                                      course.difficulty_level === 2 ? 'Intermediate' :
                                      'Advanced'}
              </span>
          </>
      )}
        </p>

      {/* Course Instructor */}
      <p className="text-sm text-gray-800 flex items-center gap-2">
        {course.instructor_name ? course.instructor_name : 'Unknown Instructor'}
      </p>

      {/* Course Description */}
      {isEditing ? (
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded-md p-2 w-full text-gray-800 mt-2"
          rows={3}
        ></textarea>
      ) : (
        <p className="mt-2 text-lg text-gray-900">
          {course.description.length > 150
            ? course.description.substring(0, 150) + '...'
            : course.description}
        </p>
      )}

      {/* Course Image */}
      {isEditing ? (
        <input
          type="text"
          value={imagePath}
          onChange={(e) => setImagePath(e.target.value)}
          className="border rounded-md p-2 w-full mt-2"
          placeholder="Image URL"
        />
      ) : (
        <img src={course.image_path} alt="Course Image" className="mt-4 w-full h-48 object-cover rounded-md" />
      )}

     {/* Keywords */}
{isEditing ? (
  <Select
    isMulti
    value={keywords.split(',').map((keyword) => ({
      value: keyword.trim(),
      label: keyword.trim(),
    }))}
    onChange={(selectedOptions: any) =>
      setKeywords(selectedOptions.map((option: any) => option.value).join(', '))
    }
    options={keywordOptions}
    className="mt-2 w-full"
  />
) : (
  <div className="mt-2 text-lg text-gray-900">
    <p className="font-semibold text-xl">Keywords:</p>
    <div className="flex flex-wrap gap-2 mt-1">
      {course.keywords.map((keyword, index) => (
        <span
          key={index}
          className="inline-flex items-center py-1 px-3 text-sm font-medium rounded-full shadow-lg transition duration-200 bg-slate-200 text-slate-600 border-slate-500"
        >
          {keyword}
        </span>
      ))}
    </div>
  </div>
)}

      {/* Divider */}
      <hr className="my-3 border-gray-300" />

      {/* Actions */}
      <div className="flex justify-between items-center">
        {/* Update and Delete Buttons */}
        {(isCoursePage) && (
          <div className="flex gap-3">
            {onUpdate && (
              isEditing ? (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300"
                >
                  <FiSave className="text-lg" />
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)} // Start editing when clicked
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                >
                  <FiEdit className="text-lg" />
                  Update
                </button>
              )
            )}
            {onDelete && (
              <button
                onClick={onDelete} // Trigger delete action
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300"
              >
                <FiTrash2 className="text-lg" />
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
