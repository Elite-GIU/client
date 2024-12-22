import React, { useState } from "react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  students: { user_id: string; name: string }[];
  onCreateGroup: (title: string, description: string, selectedStudents: string[]) => void;
}

const StudentGroupPopup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  students,
  onCreateGroup,
}) => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const toggleSelection = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((studentId) => studentId !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = () => {
    onCreateGroup(title, description, selectedStudents);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Create a New Study Room</h2>

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Room Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter room title"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter room description"
            rows={3}
          />
        </div>

        <ul className="divide-y divide-gray-300">
          {students.map((student) => (
            <li
              key={student.user_id}
              className="flex items-center p-3 hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.user_id)}
                onChange={() => toggleSelection(student.user_id)}
                className="mr-3"
              />
              <span>{student.name}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleCreateGroup}
            disabled={!title.trim() || !description.trim() || selectedStudents.length === 0}
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentGroupPopup;
