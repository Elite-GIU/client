'use client';

import React, { useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import FormCard from '../../components/auth/FormCard';
import InputField from '../../components/InputField';
import AuthButton from '../../components/auth/AuthButton';
import TutorFlowLogo from '../../components/TutorFlowLogo';
import { useRouter } from 'next/navigation';
import { startAuthentication } from '@simplewebauthn/browser';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [biometricCheckDone, setBiometricCheckDone] = useState(false); 
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const router = useRouter();

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
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      if (data.isRegistered) {
        setBiometricAvailable(true);
        setMessage('Biometric authentication is available. Proceeding with biometric login.');
        handleBiometricLogin();
      } else {
        setBiometricAvailable(false);
        setMessage('Biometric authentication not available. Please enter your password to proceed.');
      }

      setBiometricCheckDone(true);
    } catch (err) {
      setError('Failed to check biometric authentication. Please try again.');
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
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 sm:px-6">
      <div className="mb-12">
        <TutorFlowLogo size="text-5xl" />
      </div>
      <FormCard title={biometricCheckDone ? (biometricAvailable ? 'Biometric Login' : 'Welcome Back') : 'Welcome Back'}>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
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
            <AuthButton label="Check Biometric" onClick={handleInitialLogin} />
          ) : (
            biometricAvailable ? (
              <AuthButton label="Proceed with Biometric Login" onClick={handleBiometricLogin} />
            ) : (
              <AuthButton label="Login" onClick={handlePasswordLogin} />
            )
          )}
        </div>
      </FormCard>
    </div>
  );
};

export default LoginPage;
