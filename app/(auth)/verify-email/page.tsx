"use client";

import AuthButton from "@/app/components/auth/AuthButton";
import FormCard from "@/app/components/auth/FormCard";
import InputField from "@/app/components/InputField";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TutorFlowLogo from "@/app/components/TutorFlowLogo";
import { set } from "date-fns";

const VerifyEmailPage = () => {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendOtp, setResendOtp] = useState(false);
  const [password, setPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  const handleVerifyOtp = async () => {
    setError("");
    setSuccessMessage("");
    setResendOtp(false);

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (response.status === 401) {
        setError("Incorrect or Invalid OTP");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "OTP verification failed.");
        return;
      }
      setSuccessMessage("Account verified successfully! You can now log in.");
      setIsVerified(true);
    } catch (err) {
      setError(
        (err as Error).message || "An error occurred during OTP verification."
      );
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "OTP resend failed.");
        return;
      }

      setSuccessMessage("OTP sent successfully. Please check your email.");
      setResendOtp(false);
    } catch (err) {
      setError(
        (err as Error).message || "An error occurred while resending OTP."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 sm:px-6">
      <div className="mb-8 sm:mb-12">
        <TutorFlowLogo size="text-4xl sm:text-5xl" />
      </div>
      <FormCard title="Verify Email">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!resendOtp && (
          <InputField
            label="OTP"
            type="text"
            placeholder="Enter the OTP sent to your email"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}
        {resendOtp && (
          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        {resendOtp && (
          <div>
            <div className="flex justify-center mb-4">
              <AuthButton label="Resend OTP" onClick={handleResendOtp} />
            </div>
            <p className="text-center text-sm text-gray-600">
            Already verified?{" "}
            <a href="/login" className="text-[#3D5A80] hover:underline">
              Log in
            </a>
          </p>
          </div>
        )}
        {!resendOtp && !isVerified && (
          <div className="flex justify-center mb-4">
            <AuthButton label="Verify OTP" onClick={handleVerifyOtp} />
          </div>
        )}
        {/*resend otp*/}
        {!resendOtp && !isVerified && (
          <button
            onClick={() => {
              setResendOtp(true);
              setError("");
              setSuccessMessage("");
            }}
            className="text-center text-blue-500 cursor-pointer">
            Resend OTP
          </button>
        )}
        {isVerified && (
          <a
            href="/login"
            className="self-center text-[#3D5A80] hover:underline">
            <AuthButton label="Log in" />
          </a>
        )}
      </FormCard>
    </div>
  );
};

export default VerifyEmailPage;
