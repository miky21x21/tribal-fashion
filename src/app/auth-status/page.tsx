'use client';

import { useSession } from 'next-auth/react';

export default function AuthStatusPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light flex items-center justify-center p-4">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-tribal-dark mb-6 text-center">
          Auth Status
        </h1>
        
        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <h2 className="text-lg font-semibold text-tribal-dark mb-2">
              Status: {status}
            </h2>
            <div className="text-sm text-tribal-brown">
              {status === 'loading' && 'Checking authentication...'}
              {status === 'authenticated' && '✅ User is signed in!'}
              {status === 'unauthenticated' && '❌ User is not signed in'}
            </div>
          </div>

          {session && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <h2 className="text-lg font-semibold text-tribal-dark mb-2">
                User Info
              </h2>
              <div className="space-y-2 text-sm text-tribal-brown">
                <div><strong>Name:</strong> {session.user?.name || 'Not provided'}</div>
                <div><strong>Email:</strong> {session.user?.email || 'Not provided'}</div>
                <div><strong>Provider:</strong> {(session as any)?.provider || 'Unknown'}</div>
              </div>
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <h2 className="text-lg font-semibold text-tribal-dark mb-2">
              Next Steps
            </h2>
            <div className="text-sm text-tribal-brown space-y-2">
              <div>1. ✅ NextAuth is configured</div>
              <div>2. 🔑 Set OAuth credentials in .env.local</div>
              <div>3. 🧪 Test at /login page</div>
              <div>4. 🎯 Both Google & Apple sign-in ready</div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/login" 
            className="inline-block bg-tribal-red/90 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-semibold hover:bg-tribal-red-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );
}
