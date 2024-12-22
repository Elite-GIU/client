'use client';

import React, { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import FormCard from '../../components/auth/FormCard';
import InputField from '../../components/InputField';
import AuthButton from '../../components/auth/AuthButton';
import TutorFlowLogo from '../../components/TutorFlowLogo';
import { useRouter } from 'next/navigation';
import { startAuthentication } from '@simplewebauthn/browser';
import { getCookie } from 'cookies-next';
import Loading from '@/app/loading';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [biometricCheckDone, setBiometricCheckDone] = useState(false); 
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    const token = getCookie('Token');
    if (token) {
      setIsLoading(false);
      router.push('/dashboard');
    }
    setIsLoading(false);
  }, [router]
  , );
  const handleInitialLogin = async () => {
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const browserFingerprint = result.visitorId;

      const response = await fetch('/api/auth/check-biometric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, browserFingerprint }),
      });

      if (!response.ok) {
        throw new Error(`Invalid email`);
      }

      
      const data = await response.json();
      if (data.isRegistered) {
        setBiometricAvailable(true);
        handleBiometricLogin();
      } else {
        setBiometricAvailable(false);
      }

      setBiometricCheckDone(true);
    } catch (err) {
      setError((err as Error).message || 'Biometric check failed');
      setBiometricCheckDone(true);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const authOptionsResponse = await fetch('/api/auth/start-biometric-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!authOptionsResponse.ok) {
        throw new Error('Failed to get biometric authentication options from server');
      }

      const authOptions = await authOptionsResponse.json();


      const assertion = await startAuthentication( {optionsJSON: authOptions.options} );
    
      const verificationResponse = await fetch('/api/auth/finish-biometric-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          assertion,
        })
      });

      const verificationResult = await verificationResponse.json();

      
      if (!verificationResponse.ok) {
        throw new Error(verificationResult.message || 'Biometric verification failed');
      }
      if (verificationResult.verified) {
        router.push('/dashboard'); 
      } else {
        throw new Error('Biometric verification failed');
      }
    } catch (err) {
      setError((err as Error).message || 'Biometric login failed');
    }
  };

  const handlePasswordLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.error || 'Login failed');
      } else {
        setError('');
        router.push(`/biometric-setup?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      setError((err as Error).message || 'Login failed');
    }
  };

  if (isLoading) {
    return <Loading />;
  }
  else {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 sm:px-6">
      <div className="mb-12">
        <TutorFlowLogo size="text-5xl" />
      </div>
      <FormCard title= 'Welcome Back'>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {biometricCheckDone && !biometricAvailable && (
          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        <div className="flex justify-center">
          {!biometricCheckDone ? (
            <AuthButton label="Login" onClick={handleInitialLogin} />
          ) : (
            biometricAvailable ? (
              <AuthButton label="Login" onClick={handleBiometricLogin} />
            ) : (
              <AuthButton label="Login" onClick={handlePasswordLogin} />
            )
          )}
        </div>
        <p className="mt-5 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-[#3D5A80] hover:underline">
            Register a new account
          </a>
        </p>
      </FormCard>
    </div>
  );
}
};

export default LoginPage;
