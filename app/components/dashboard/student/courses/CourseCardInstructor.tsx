import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiSave } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

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


  
  return (
    
    <div className="bg-white rounded-lg p-8 shadow border hover:shadow-lg transition-shadow duration-300">
     
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
                        className="ml-2 border rounded-md p-1">
                        <option value={1}>Beginner</option>
                        <option value={2}>Intermediate</option>
                        <option value={3}>Advanced</option>
                        {/* Replace values with corresponding numbers */}
                    </select>
                    </label>
            </>
        ) : (
            <>
            <span>Category: {course.category}</span> | 
            <span>Difficulty Level: {course.difficulty_level}</span>
            </>
        )}
        </p>

      {/* Course Instructor */}
      <p className="text-sm text-gray-800 flex items-center gap-2">
        Instructor: {course.instructor_name ? course.instructor_name : 'Unknown'}
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
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="border rounded-md p-2 w-full mt-2"
          placeholder="Enter keywords (separate by commas)"
        />
      ) : (
        <p className="mt-2 text-lg text-gray-900">
          Keywords: {course.keywords.join(', ')}
        </p>
      )}

      {/* Divider */}
      <hr className="my-3 border-gray-300" />

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center text-black hover:underline cursor-pointer">
          <p>Course Details</p>
        </div>

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
