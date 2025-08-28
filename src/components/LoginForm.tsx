"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface LoginFormState {
  phoneNumber: string;
  otpCode: string;
  isPhoneValid: boolean;
  isOtpSent: boolean;
  isOtpVerified: boolean;
  timer: number;
  isGoogleLoading: boolean;
  isAppleLoading: boolean;
  isPhoneLoading: boolean;
  isVerifyLoading: boolean;
  error: string;
  showProfileCompletion: boolean;
  firstName: string;
  lastName: string;
  email: string;
}

interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phoneNumber?: string;
  profileComplete: boolean;
}

interface LoginFormProps {
  onLogin?: (token: string, user: User) => void;
  onProfileComplete?: (userData: User) => void;
}

export default function LoginForm({ onLogin, onProfileComplete }: LoginFormProps) {
  const [state, setState] = useState<LoginFormState>({
    phoneNumber: "",
    otpCode: "",
    isPhoneValid: false,
    isOtpSent: false,
    isOtpVerified: false,
    timer: 0,
    isGoogleLoading: false,
    isAppleLoading: false,
    isPhoneLoading: false,
    isVerifyLoading: false,
    error: "",
    showProfileCompletion: false,
    firstName: "",
    lastName: "",
    email: "",
  });

  // Timer countdown effect
  useEffect(() => {
    if (state.timer > 0) {
      const interval = setInterval(() => {
        setState(prev => ({ ...prev, timer: prev.timer - 1 }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.timer]);

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ""));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setState(prev => ({
      ...prev,
      phoneNumber: phone,
      isPhoneValid: validatePhoneNumber(phone),
      error: ""
    }));
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const otp = e.target.value.replace(/\D/g, "").slice(0, 6);
    setState(prev => ({ ...prev, otpCode: otp, error: "" }));
  };

  const handleSendOtp = async () => {
    if (!state.isPhoneValid) return;

    setState(prev => ({ ...prev, isPhoneLoading: true, error: "" }));
    
    try {
      const response = await fetch('/api/auth/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber: state.phoneNumber,
          action: 'send-otp'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          isPhoneLoading: false,
          isOtpSent: true,
          timer: 60
        }));
      } else {
        setState(prev => ({
          ...prev,
          isPhoneLoading: false,
          error: data.message || 'Failed to send OTP'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isPhoneLoading: false,
        error: 'Network error. Please try again.'
      }));
    }
  };

  const handleVerifyOtp = async () => {
    if (state.otpCode.length !== 6) return;

    setState(prev => ({ ...prev, isVerifyLoading: true, error: "" }));
    
    try {
      // First verify the OTP
      const verifyResponse = await fetch('/api/auth/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: state.phoneNumber,
          otpCode: state.otpCode,
          action: 'verify-otp'
        })
      });

      const verifyData = await verifyResponse.json();
      
      if (verifyData.success) {
        // Now register/login the user
        const registerResponse = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: 'phone',
            phoneNumber: state.phoneNumber
          })
        });

        const registerData = await registerResponse.json();
        
        if (registerData.success) {
          const user = registerData.data.user;
          
          if (!user.profileComplete) {
            setState(prev => ({
              ...prev,
              isVerifyLoading: false,
              isOtpVerified: true,
              showProfileCompletion: true
            }));
          } else {
            setState(prev => ({ ...prev, isVerifyLoading: false, isOtpVerified: true }));
            onLogin?.(registerData.data.token, user);
          }
        } else {
          setState(prev => ({
            ...prev,
            isVerifyLoading: false,
            error: registerData.message || 'Failed to register user'
          }));
        }
      } else {
        setState(prev => ({
          ...prev,
          isVerifyLoading: false,
          error: verifyData.message || 'Invalid verification code'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isVerifyLoading: false,
        error: 'Network error. Please try again.'
      }));
    }
  };

  const handleGoogleLogin = async () => {
    setState(prev => ({ ...prev, isGoogleLoading: true, error: "" }));
    
    try {
      // This would integrate with Google OAuth library
      // For now, simulate the process
      setState(prev => ({ ...prev, isGoogleLoading: false, error: "Google OAuth integration pending" }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isGoogleLoading: false,
        error: 'Google login failed. Please try again.'
      }));
    }
  };

  const handleAppleLogin = async () => {
    setState(prev => ({ ...prev, isAppleLoading: true, error: "" }));
    
    try {
      // This would integrate with Apple Sign In
      // For now, simulate the process
      setState(prev => ({ ...prev, isAppleLoading: false, error: "Apple Sign In integration pending" }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isAppleLoading: false,
        error: 'Apple login failed. Please try again.'
      }));
    }
  };

  const handleProfileComplete = async () => {
    if (!state.firstName.trim() || !state.lastName.trim()) {
      setState(prev => ({ ...prev, error: "First name and last name are required" }));
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          firstName: state.firstName,
          lastName: state.lastName,
          email: state.email
        })
      });

      const data = await response.json();
      
      if (data.success) {
        onProfileComplete?.(data.data.user);
      } else {
        setState(prev => ({ ...prev, error: data.message || 'Failed to update profile' }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Network error. Please try again.' }));
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-tribal-cream border-4 border-tribal-brown rounded-none shadow-2xl p-8 relative overflow-hidden">
      {/* Tribal pattern overlay */}
      <div className="absolute inset-0 bg-tribal-cream-pattern-subtle opacity-30 pointer-events-none"></div>
      
      {/* Logo Section */}
      <div className="relative text-center mb-12">
        <div className="inline-block p-4 bg-tribal-red rounded-full mb-6 shadow-lg">
          <Image
            src="/components/kanirlogo.jpeg"
            alt="Kinir Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>
        <h2 className="text-3xl font-kiner text-tribal-dark font-bold tracking-wide">
          <span className="double-underline">K</span>
          <span className="double-underline">i</span>n
          <span className="double-underline">i</span>r
        </h2>
        <p className="text-tribal-brown mt-2 font-medium">Anything Tribal</p>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="mb-6 p-4 bg-red-100 border-2 border-red-400 text-red-700 rounded-none">
          {state.error}
        </div>
      )}

      {/* Profile Completion Form */}
      {state.showProfileCompletion && (
        <div className="space-y-6 relative z-10">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-tribal-dark">Complete Your Profile</h3>
            <p className="text-tribal-brown">Help us personalize your experience</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={state.firstName}
              onChange={(e) => setState(prev => ({ ...prev, firstName: e.target.value }))}
              placeholder="First Name"
              className="border-3 border-tribal-brown bg-white text-tribal-dark py-4 px-6 rounded-none text-lg font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-4 focus:ring-tribal-red focus:ring-opacity-20"
            />
            <input
              type="text"
              value={state.lastName}
              onChange={(e) => setState(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Last Name"
              className="border-3 border-tribal-brown bg-white text-tribal-dark py-4 px-6 rounded-none text-lg font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-4 focus:ring-tribal-red focus:ring-opacity-20"
            />
          </div>
          
          <input
            type="email"
            value={state.email}
            onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Email (optional)"
            className="w-full border-3 border-tribal-brown bg-white text-tribal-dark py-4 px-6 rounded-none text-lg font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-4 focus:ring-tribal-red focus:ring-opacity-20"
          />
          
          <button
            onClick={handleProfileComplete}
            className="w-full bg-tribal-green text-tribal-cream py-4 px-6 rounded-none font-bold text-lg hover:bg-royal-green transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Complete Profile
          </button>
        </div>
      )}

      {/* Authentication Methods */}
      {!state.showProfileCompletion && (
        <div className="space-y-6 relative z-10">
          
          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={state.isGoogleLoading}
            className="w-full bg-white border-3 border-tribal-red text-tribal-dark py-4 px-6 rounded-none font-semibold text-lg hover:bg-tribal-cream hover:border-tribal-brown transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            {state.isGoogleLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tribal-red"></div>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Apple Sign In Button */}
          <button
            onClick={handleAppleLogin}
            disabled={state.isAppleLoading}
            className="w-full bg-tribal-dark text-tribal-cream py-4 px-6 rounded-none font-semibold text-lg hover:bg-tribal-brown transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            {state.isAppleLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tribal-cream"></div>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span>Continue with Apple</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-tribal-brown"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-tribal-cream text-tribal-dark font-medium">or continue with phone</span>
            </div>
          </div>

          {/* Phone Number Input */}
          {!state.isOtpSent && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="tel"
                  value={state.phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter phone number (e.g., +1234567890)"
                  className="w-full border-3 border-tribal-brown bg-white text-tribal-dark py-4 px-6 rounded-none text-lg font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-4 focus:ring-tribal-red focus:ring-opacity-20"
                />
                {state.isPhoneValid && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-tribal-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <button
                onClick={handleSendOtp}
                disabled={!state.isPhoneValid || state.isPhoneLoading}
                className="w-full bg-tribal-red text-tribal-cream py-4 px-6 rounded-none font-bold text-lg hover:bg-tribal-red-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                {state.isPhoneLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tribal-cream"></div>
                ) : (
                  <span>Send Verification Code</span>
                )}
              </button>
            </div>
          )}

          {/* OTP Verification */}
          {state.isOtpSent && !state.isOtpVerified && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-tribal-brown font-medium mb-2">
                  Verification code sent to {state.phoneNumber}
                </p>
                {state.timer > 0 && (
                  <p className="text-tribal-red font-bold text-lg">
                    Resend in {formatTime(state.timer)}
                  </p>
                )}
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  value={state.otpCode}
                  onChange={handleOtpChange}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full border-3 border-tribal-brown bg-white text-tribal-dark py-4 px-6 rounded-none text-lg font-mono text-center tracking-widest focus:outline-none focus:border-tribal-red focus:ring-4 focus:ring-tribal-red focus:ring-opacity-20"
                />
                {state.otpCode.length === 6 && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-tribal-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={state.otpCode.length !== 6 || state.isVerifyLoading}
                className="w-full bg-tribal-green text-tribal-cream py-4 px-6 rounded-none font-bold text-lg hover:bg-royal-green disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                {state.isVerifyLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tribal-cream"></div>
                ) : (
                  <span>Verify Code</span>
                )}
              </button>

              {state.timer === 0 && (
                <button
                  onClick={handleSendOtp}
                  className="w-full text-tribal-red font-semibold underline hover:text-tribal-red-accent transition-colors duration-300"
                >
                  Resend verification code
                </button>
              )}
            </div>
          )}

          {/* Success State */}
          {state.isOtpVerified && !state.showProfileCompletion && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-tribal-green rounded-full mb-4">
                <svg className="w-8 h-8 text-tribal-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-tribal-green">Phone Verified!</h3>
              <p className="text-tribal-brown">Welcome to Kinir - Anything Tribal</p>
            </div>
          )}
        </div>
      )}

      {/* Decorative tribal elements */}
      <div className="absolute -top-4 -left-4 w-8 h-8 border-4 border-tribal-red transform rotate-45 opacity-30"></div>
      <div className="absolute -top-4 -right-4 w-8 h-8 border-4 border-tribal-red transform rotate-45 opacity-30"></div>
      <div className="absolute -bottom-4 -left-4 w-8 h-8 border-4 border-tribal-red transform rotate-45 opacity-30"></div>
      <div className="absolute -bottom-4 -right-4 w-8 h-8 border-4 border-tribal-red transform rotate-45 opacity-30"></div>
    </div>
  );
}