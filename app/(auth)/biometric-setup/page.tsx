'use client'

import React, { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import FormCard from '../../components/auth/FormCard';
import AuthButton from '../../components/auth/AuthButton';
import TutorFlowLogo from '../../components/TutorFlowLogo';
import { startRegistration } from '@simplewebauthn/browser';
import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import Loading from '@/app/loading';

const BiometricSetup: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  
  const checkBiometricRegistration = async () => {
    try {
      const token = getCookie('Token') as string;
      
      if (!token) {
        router.push('/login');
      }

      const { email } = jwtDecode<{ email: string }>(token);
      const userEmail = email;
      if (!userEmail) {
        throw new Error('Email is not available in the token');
      }
      setEmail(userEmail);

      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const browserFingerprint = result.visitorId;

      const checkResponse = await fetch('/api/auth/check-biometric', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, browserFingerprint }),
      });

      if (!checkResponse.ok) {
        throw new Error('Failed to check biometric registration status');
      }

      const responseData = await checkResponse.json();
      if (responseData.isRegistered) {
        setIsRegistered(true);
        router.push('/dashboard');
      }
    } catch (err) {
      setError((err as Error).message || 'An error occurred while checking biometric registration status');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    checkBiometricRegistration();
  });

  const handleRegisterBiometric = async () => {
    try {
      const token = Cookies.get('Token');
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const browserFingerprint = result.visitorId;
      const registerResponse = await fetch('/api/auth/register-webauthn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, browserFingerprint }),
      });

      if (!registerResponse.ok) {
        const errorResponse = await registerResponse.json();
        throw new Error(errorResponse.message || 'Failed to register for biometric authentication');
      }

      const responseData = await registerResponse.json();
      const { options } = responseData;
      if (!options) {
        throw new Error('Failed to retrieve registration options.');
      }
      
      const webAuthnResponse = await startRegistration({ optionsJSON: {...options, useAutoRegister: true} });
      
      const verifyResponse = await fetch('/api/auth/verify-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          browserFingerprint,
          webAuthnResponse,
        }),
      });

      if (!verifyResponse.ok) {
        const verifyError = await verifyResponse.json();
        throw new Error(verifyError.message || 'Failed to verify biometric registration');
      }

      setMessage('Biometric authentication enabled successfully!');
    } catch (err) {
      setError((err as Error).toString() || 'Failed to enable biometric authentication');
    }
  };

  if (isLoading) {
    return <Loading />; 
  }

  if (!isRegistered) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 sm:px-6">
        <div className="mb-12">
          <TutorFlowLogo size="text-5xl" />
        </div>
        <FormCard title="Make Login Easier">
          {message && <p className="text-green-500 text-center mb-4">{message}</p>}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {!isRegistered && (
            <div className="flex justify-center">
              <AuthButton
                label="Enable Biometric Authentication"
                onClick={handleRegisterBiometric}
                disabled={isRegistered}
              />
            </div>
          )}
        </FormCard>
      </div>
    );
  }
};

export default BiometricSetup;