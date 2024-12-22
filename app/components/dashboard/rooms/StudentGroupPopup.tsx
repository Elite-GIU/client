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
      <div className="bg-white w-[500px] lg:w-[600px] rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a New Study Room</h2>

        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Room Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter room title"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter room description"
            rows={4}
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Select Students</h3>
          <ul className="max-h-48 overflow-y-auto divide-y divide-gray-200 border rounded-lg">
            {students.map((student) => (
              <li
                key={student.user_id}
                className="flex items-center px-4 py-3 hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.user_id)}
                  onChange={() => toggleSelection(student.user_id)}
                  className="mr-4"
                />
                <span className="text-gray-800">{student.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-6 py-3 text-white rounded-lg focus:outline-none ${
              !title.trim() || !description.trim() || selectedStudents.length === 0
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
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
