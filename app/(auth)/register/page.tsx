"use client";
import React, { use, useState } from 'react';
import FormCard from '../../components/auth/FormCard';
import InputField from '../../components/InputField';
import AuthButton from '../../components/auth/AuthButton';
import TutorFlowLogo from '../../components/TutorFlowLogo';
import { useRouter } from 'next/navigation';

// Import Heroicons
import { BookOpenIcon, UserIcon } from '@heroicons/react/24/outline';
import { set } from 'date-fns';
import { divider } from '@nextui-org/theme';

const preferences = [
  "Data Science",
  "Security",
  "Software",
  "Media",
  "Coding",
  "Databases",
  "Programming",
  "Math",
  "Business",
  "Analytics",
  "Deep Learning",
  "Management",
];

const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [preferrences, setPreferrences] = useState(false);
  const [preferenceList, setPreferenceList] = useState<string[]>([]);
  const router = useRouter();



  const handleSignUp = async () => {
    setError('');
    setSuccessMessage('');

    if (!fullName || !email || !password || !confirmPassword || !selectedRole) {
      setError('Please fill in all fields and select a role.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          password,
          role: selectedRole,
          preferenceList
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Registration failed.');
        return;
      }

      setSuccessMessage('Registration successful! Please verify your email.');

      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setSelectedRole(null);
      router.push('/verify-email');
    } catch (err) {
      setError((err as Error).message || 'An error occurred during registration.');
    }
  };

  const togglePreference = (preference: string) => {
    setPreferenceList((prevList) =>
      prevList.includes(preference)
        ? prevList.filter((item) => item !== preference)
        : [...prevList, preference]
    );
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 sm:px-6">
      <div className="mb-8 sm:mb-12">
        <TutorFlowLogo size="text-4xl sm:text-5xl" />
      </div>
      
      <div>
      <div>
       <FormCard title="Create a new Account">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
          <InputField
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputField
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">I Want to:</p>
            <div className="flex flex-row space-x-4">
              <button
                onClick={() => setSelectedRole("student")}
                className={`flex-1 py-4 sm:py-6 border rounded-lg flex flex-col items-center justify-center text-gray-700 hover:bg-gray-100 ${
                  selectedRole === "student" ? "border-[#3D5A80]" : "border-gray-300"
                }`}
              >
                <BookOpenIcon className="w-8 h-8 sm:w-10 sm:h-10 mb-2" />
                <span className="text-xs sm:text-sm font-medium">Learn as Student</span>
              </button>
              <button
                onClick={() => setSelectedRole("instructor")}
                className={`flex-1 py-4 sm:py-6 border rounded-lg flex flex-col items-center justify-center text-gray-700 hover:bg-gray-100 ${
                  selectedRole === "instructor" ? "border-[#3D5A80]" : "border-gray-300"
                }`}
              >
                <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 mb-2" />
                <span className="text-xs sm:text-sm font-medium">Teach as Instructor</span>
              </button>
            </div>
          </div>
          <div>
          <div className="mb-6">
            <p className="text-lg font-semibold text-gray-800 mb-6 text-center">Select the topics that interest you</p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {preferences.map((preference) => (
                <button
                  key={preference}
                  onClick={() => togglePreference(preference)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition duration-300 ease-in-out ${
                    preferenceList.includes(preference)
                      ? "bg-[#3D5A80] text-white shadow-lg scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {preference}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <AuthButton label="Sign up" onClick={handleSignUp} />
          </div>
      </div>
          <br />
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-[#3D5A80] hover:underline">
              Sign In
            </a>
          </p>
          <br />
          <p className="text-center text-sm text-gray-600">
            Need to verify your email?{" "}
            <a href="/verify-email" className="text-[#3D5A80] hover:underline">
              Verify Email
            </a>
          </p>
        </FormCard>
       </div>
       
      
      </div>
    
     
    </div>
  );
};

export default RegisterPage;
