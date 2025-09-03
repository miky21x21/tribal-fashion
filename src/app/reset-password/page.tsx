'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ResetPasswordState {
  newPassword: string;
  confirmPassword: string;
  isLoading: boolean;
  error: string;
  success: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<ResetPasswordState>({
    newPassword: '',
    confirmPassword: '',
    isLoading: false,
    error: '',
    success: '',
  });

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setState(prev => ({ ...prev, error: 'Invalid reset link. Please request a new password reset.' }));
    }
  }, [token]);

  const validateForm = (): boolean => {
    if (state.newPassword.length < 6) {
      setState(prev => ({ ...prev, error: 'Password must be at least 6 characters long' }));
      return false;
    }
    if (state.newPassword !== state.confirmPassword) {
      setState(prev => ({ ...prev, error: 'Passwords do not match' }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setState(prev => ({ ...prev, error: 'Invalid reset link. Please request a new password reset.' }));
      return;
    }

    if (!validateForm()) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          newPassword: state.newPassword 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setState(prev => ({ 
          ...prev, 
          success: data.message || 'Password reset successfully!',
          isLoading: false 
        }));
        
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setState(prev => ({ 
          ...prev, 
          error: data.message || 'Failed to reset password',
          isLoading: false 
        }));
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'An error occurred. Please try again.',
        isLoading: false 
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            Invalid reset link. Please request a new password reset.
          </div>
          <Link 
            href="/forgot-password" 
            className="inline-block bg-tribal-red text-white py-3 px-6 rounded-xl text-sm font-medium hover:bg-tribal-red-accent transition-all duration-300"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-tribal-dark mb-2">
            Reset Password
          </h2>
          <p className="text-tribal-brown text-sm">
            Enter your new password below.
          </p>
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {state.error}
          </div>
        )}

        {/* Success Message */}
        {state.success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
            {state.success}
          </div>
        )}

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password Input */}
          <input
            type="password"
            value={state.newPassword}
            onChange={(e) => setState(prev => ({ ...prev, newPassword: e.target.value, error: '' }))}
            onKeyPress={handleKeyPress}
            placeholder="New Password (min. 6 characters)"
            className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
            required
          />
          
          {/* Confirm Password Input */}
          <input
            type="password"
            value={state.confirmPassword}
            onChange={(e) => setState(prev => ({ ...prev, confirmPassword: e.target.value, error: '' }))}
            onKeyPress={handleKeyPress}
            placeholder="Confirm New Password"
            className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
            required
          />
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={state.isLoading}
            className="w-full bg-tribal-red text-white py-3 px-4 rounded-xl text-sm font-medium hover:bg-tribal-red-accent focus:outline-none focus:ring-2 focus:ring-tribal-red focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <Link 
            href="/login" 
            className="text-sm text-tribal-red hover:text-tribal-red-accent underline transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
