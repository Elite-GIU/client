import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { BiSolidCommentDots } from "react-icons/bi";
import { FiEdit, FiTrash2, FiSave } from "react-icons/fi";
import ThreadRole from './ThreadRole'; // Import the new component
import { usePathname } from 'next/navigation';

interface ThreadCardProps {
  thread: {
    _id: string;
    title: string;
    creator_id: {
      name: string;
      role: string;
    };
    createdAt: string;
    description: string;
    messagesCount: number;
  };
  onUpdate?: (updatedTitle: string, updatedDescription: string) => void; // Optional function to handle update
  onDelete?: () => void; // Optional function to handle delete
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(thread.title);
  const [description, setDescription] = useState(thread.description);
  const pathname = usePathname();

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(title, description);
    }
    setIsEditing(false);
  };

  const isThreadsPage = pathname.endsWith('/threads');

  return (
    <div className="bg-white rounded-lg p-8 shadow border hover:shadow-lg transition-shadow duration-300">
      {/* Thread Title and Timestamp */}
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-md p-2 w-full text-lg font-semibold text-black"
          />
        ) : (
          <h3 className="font-semibold text-2xl text-black">{thread.title}</h3>
        )}
        <span className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
        </span>
      </div>

      {/* Thread Creator and Role */}
      <p className="text-sm text-gray-800 flex items-center gap-2">
        Posted by {thread.creator_id.name}
        <ThreadRole role={thread.creator_id.role} />
      </p>

      {/* Thread Description */}
      {isEditing ? (
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded-md p-2 w-full text-gray-800 mt-2"
          rows={3}
        ></textarea>
      ) : (
        <p className="mt-2 text-lg text-gray-900">
          {thread.description.length > 150
            ? thread.description.substring(0, 150) + '...'
            : thread.description}
        </p>
      )}

      {/* Divider */}
      <hr className="my-3 border-gray-300" />

      {/* Actions and Replies Count */}
      <div className="flex justify-between items-center">
        <div className="flex items-center text-black hover:underline cursor-pointer">
          <BiSolidCommentDots className="text-xl text-gray-600 mr-2" />
          <p>{thread.messagesCount} {thread.messagesCount === 1 ? 'reply' : 'replies'}</p>
        </div>

        {/* Update and Delete Buttons (Visible only for thread master and not on threads page) */}
        {thread.creator_id.role === 'thread master' && !isThreadsPage && (onUpdate || onDelete) && (
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
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                >
                  <FiEdit className="text-lg" />
                  Update
                </button>
              )
            )}
            {onDelete && (
              <button
                onClick={onDelete}
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

export default ThreadCard;
