'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../../components/LoginForm';

interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phoneNumber?: string;
  profileComplete: boolean;
}

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (token: string, user: User) => {
    // Store the token
    localStorage.setItem('token', token);
    
    // Redirect based on profile completion
    if (user.profileComplete) {
      router.push('/dashboard');
    } else {
      // Profile completion will be handled within the LoginForm
      console.log('User profile incomplete, showing completion form');
    }
  };

  const handleProfileComplete = () => {
    // Once profile is complete, redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginForm 
          onLogin={handleLogin} 
          onProfileComplete={handleProfileComplete} 
        />
      </div>
    </div>
  );
}