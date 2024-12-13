"use client";
import React, { useState } from 'react';
import FormCard from '../../components/auth/FormCard';
import InputField from '../../components/InputField';
import AuthButton from '../../components/auth/AuthButton';
import TutorFlowLogo from '../../components/TutorFlowLogo';

// Import Heroicons
import { BookOpenIcon, UserIcon } from '@heroicons/react/24/outline';

const RegisterPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 sm:px-6">
      <div className="mb-8 sm:mb-12">
        <TutorFlowLogo size="text-4xl sm:text-5xl" />
      </div>
      <FormCard title="Create a new Account">
        <InputField label="Full Name" type="text" placeholder="Enter your full name" />
        <InputField label="Email" type="email" placeholder="Enter your email" />
        <InputField label="Password" type="password" placeholder="Enter your password" />
        <InputField label="Confirm Password" type="password" placeholder="Confirm your password" />
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">I Want to:</p>
          <div className="flex flex-row space-x-4">
            <button
              onClick={() => setSelectedRole('student')}
              className={`flex-1 py-4 sm:py-6 border rounded-lg flex flex-col items-center justify-center text-gray-700 hover:bg-gray-100 ${
                selectedRole === 'student' ? 'border-[#3D5A80]' : 'border-gray-300'
              }`}
            >
              <BookOpenIcon className="w-8 h-8 sm:w-10 sm:h-10 mb-2" />
              <span className="text-xs sm:text-sm font-medium">Learn as Student</span>
            </button>
            <button
              onClick={() => setSelectedRole('instructor')}
              className={`flex-1 py-4 sm:py-6 border rounded-lg flex flex-col items-center justify-center text-gray-700 hover:bg-gray-100 ${
                selectedRole === 'instructor' ? 'border-[#3D5A80]' : 'border-gray-300'
              }`}
            >
              <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 mb-2" />
              <span className="text-xs sm:text-sm font-medium">Teach as Instructor</span>
            </button>
          </div>
        </div>
        <div className="flex justify-center mb-4">
          <AuthButton label="Sign Up" />
        </div>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-[#3D5A80] hover:underline">
            Sign In
          </a>
        </p>
      </FormCard>
    </div>
  );
};

export default RegisterPage;
