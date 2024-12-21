import React from 'react';

interface ThreadRoleProps {
  role: string;
}

const ThreadRole: React.FC<ThreadRoleProps> = ({ role }) => {
  const getRoleStyles = (role: string) => {
    switch (role.toLowerCase()) {
      case 'student':
        return 'bg-blue-100 text-blue-600 border-blue-500';
      case 'thread master':
        return 'bg-green-100 text-green-600 border-green-500';
      case 'instructor':
        return 'bg-purple-100 text-purple-600 border-purple-500';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-500';
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleStyles(
        role
      )}`}
    >
      {role}
    </span>
  );
};

export default ThreadRole;
